import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Skill,
  Opportunity,
  Event,
  mockOpportunities,
  mockEvents,
  mockCandidates,
  Candidate,
} from '@/lib/mockData';

type UserRole = 'candidate' | 'recruiter';

interface UserSettings {
  reverseHiringEnabled: boolean;
  emailNotifications: boolean;
  opportunityAlerts: boolean;
  eventNotifications: boolean;
}

interface AppContextType {
  // User state
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;

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

  // Actions
  updateOpportunityStatus: (id: string, status: 'accepted' | 'declined') => void;
  markEventCompleted: (id: string) => void;
  updateSkillScore: (skillId: string, newScore: number) => void;
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
  const [userRole, setUserRole] = useState<UserRole>('candidate');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Load skills from localStorage on init - only populated after resume upload
  const [skills, setSkillsState] = useState<Skill[]>(loadPersistedSkills);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [settings, setSettingsState] = useState<UserSettings>(loadPersistedSettings);

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
          ? { ...skill, score: newScore, assessedAt: new Date().toISOString().split('T')[0] }
          : skill
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
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
        updateOpportunityStatus,
        markEventCompleted,
        updateSkillScore,
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
