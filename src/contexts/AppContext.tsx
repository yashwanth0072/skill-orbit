import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Skill,
  Opportunity,
  Event,
  JobRole,
  mockOpportunities,
  mockEvents,
  mockCandidates,
  mockJobRoles,
  Candidate,
  calculateMatchPercentage,
} from '@/lib/mockData';
import { auth } from '@/integrations/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

type UserRole = 'candidate' | 'recruiter';

interface UserSettings {
  reverseHiringEnabled: boolean;
  emailNotifications: boolean;
  opportunityAlerts: boolean;
  eventNotifications: boolean;
}

// Job application from recruiter to candidate
export interface JobApplication {
  id: string;
  jobRoleId: string;
  jobRole: JobRole;
  candidateId?: string;
  matchPercentage: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

interface AppContextType {
  // User state
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isLoading: boolean;

  // Candidate data
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;

  // Recruiter data
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  jobRoles: JobRole[];
  setJobRoles: React.Dispatch<React.SetStateAction<JobRole[]>>;

  // Job Applications (cross-role)
  jobApplications: JobApplication[];
  setJobApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;

  // Actions
  updateOpportunityStatus: (id: string, status: 'accepted' | 'declined') => void;
  markEventCompleted: (id: string) => void;
  updateSkillScore: (skillId: string, newScore: number) => void;

  // Event management
  addEvent: (event: Event) => void;
  removeEvent: (eventId: string) => void;

  // Job role management
  addJobRole: (jobRole: JobRole) => void;
  removeJobRole: (jobRoleId: string) => void;

  // Job application management
  sendJobApplications: (jobRoleId: string) => void;
  respondToJobApplication: (applicationId: string, response: 'accepted' | 'declined') => void;
  getAcceptedCandidatesForJob: (jobRoleId: string) => Candidate[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to load persisted skills from localStorage
const loadPersistedSkills = (): Skill[] => {
  try {
    const stored = localStorage.getItem('candidateSkills');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load persisted skills:', e);
  }
  return [];
};

// Helper to load persisted settings from localStorage
const loadPersistedSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem('candidateSettings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load persisted settings:', e);
  }
  return {
    reverseHiringEnabled: true,
    emailNotifications: true,
    opportunityAlerts: true,
    eventNotifications: true,
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const stored = localStorage.getItem('userRole');
    return (stored === 'recruiter' || stored === 'candidate') ? stored : 'candidate';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load skills from localStorage on init - only populated after resume upload
  const [skills, setSkillsState] = useState<Skill[]>(loadPersistedSkills);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [events, setEventsState] = useState<Event[]>(mockEvents);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [settings, setSettingsState] = useState<UserSettings>(loadPersistedSettings);
  const [jobRoles, setJobRoles] = useState<JobRole[]>(mockJobRoles);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  // Wrapper to persist skills to localStorage
  const setSkills: React.Dispatch<React.SetStateAction<Skill[]>> = (value) => {
    setSkillsState((prev) => {
      const newSkills = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('candidateSkills', JSON.stringify(newSkills));
      } catch (e) {
        console.error('Failed to persist skills:', e);
      }
      return newSkills;
    });
  };

  // Wrapper to persist settings to localStorage
  const setSettings: React.Dispatch<React.SetStateAction<UserSettings>> = (value) => {
    setSettingsState((prev) => {
      const newSettings = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('candidateSettings', JSON.stringify(newSettings));
      } catch (e) {
        console.error('Failed to persist settings:', e);
      }
      return newSettings;
    });
  };

  // Wrapper to persist events to localStorage for live updates
  const setEvents: React.Dispatch<React.SetStateAction<Event[]>> = (value) => {
    setEventsState((prev) => {
      const newEvents = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('platformEvents', JSON.stringify(newEvents));
      } catch (e) {
        console.error('Failed to persist events:', e);
      }
      return newEvents;
    });
  };

  const updateOpportunityStatus = (id: string, status: 'accepted' | 'declined') => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, status } : opp))
    );
  };

  const markEventCompleted = (id: string) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, completed: true } : event))
    );
  };

  const updateSkillScore = (skillId: string, newScore: number) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === skillId
          ? {
            ...skill,
            score: newScore,
            assessedAt: new Date().toISOString().split('T')[0],
            status: 'assessed' as const
          }
          : skill
      )
    );
  };

  // Event management
  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const removeEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // Job role management
  const addJobRole = (jobRole: JobRole) => {
    setJobRoles((prev) => [...prev, jobRole]);
  };

  const removeJobRole = (jobRoleId: string) => {
    setJobRoles((prev) => prev.filter((jr) => jr.id !== jobRoleId));
    // Also remove related applications
    setJobApplications((prev) => prev.filter((app) => app.jobRoleId !== jobRoleId));
  };

  // Job application management - sends notifications to eligible candidates
  const sendJobApplications = (jobRoleId: string) => {
    const jobRole = jobRoles.find((jr) => jr.id === jobRoleId);
    if (!jobRole) return;

    // Calculate match for current candidate (using their skills)
    if (skills.length === 0) return;

    const matchPercentage = calculateMatchPercentage(skills, jobRole.requiredSkills);

    // Only send if match is above threshold (e.g., 60%)
    if (matchPercentage >= 60) {
      const newApplication: JobApplication = {
        id: `app-${Date.now()}`,
        jobRoleId,
        jobRole,
        matchPercentage,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setJobApplications((prev) => {
        // Avoid duplicates
        const existing = prev.find(
          (app) => app.jobRoleId === jobRoleId && app.status === 'pending'
        );
        if (existing) return prev;
        return [...prev, newApplication];
      });
    }
  };

  // Candidate responds to job application
  const respondToJobApplication = (applicationId: string, response: 'accepted' | 'declined') => {
    setJobApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: response } : app
      )
    );

    // If accepted, add to candidates list for that job
    if (response === 'accepted') {
      const application = jobApplications.find((app) => app.id === applicationId);
      if (application && skills.length > 0) {
        const newCandidate: Candidate = {
          id: `candidate-${Date.now()}`,
          name: 'Current User', // In real app, this would come from auth
          email: 'user@example.com',
          skills: skills,
          readinessIndex: Math.round(
            skills.reduce((acc, s) => acc + s.score, 0) / skills.length
          ),
          matchPercentage: application.matchPercentage,
          acceptedAt: new Date().toISOString(),
          location: 'Remote',
        };
        setCandidates((prev) => [...prev, newCandidate]);
      }
    }
  };

  // Get accepted candidates for a specific job role
  const getAcceptedCandidatesForJob = (jobRoleId: string): Candidate[] => {
    const acceptedAppIds = jobApplications
      .filter((app) => app.jobRoleId === jobRoleId && app.status === 'accepted')
      .map((app) => app.id);

    // For demo, return all candidates sorted by match
    return [...candidates]
      .filter((c) => c.acceptedAt)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        skills,
        setSkills,
        opportunities,
        setOpportunities,
        events,
        setEvents,
        settings,
        setSettings,
        candidates,
        setCandidates,
        jobRoles,
        setJobRoles,
        jobApplications,
        setJobApplications,
        updateOpportunityStatus,
        markEventCompleted,
        updateSkillScore,
        addEvent,
        removeEvent,
        addJobRole,
        removeJobRole,
        sendJobApplications,
        respondToJobApplication,
        getAcceptedCandidatesForJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
