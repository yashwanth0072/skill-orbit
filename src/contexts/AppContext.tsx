import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { isValidSkillScore } from '@/lib/validation';
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
import { supabase } from '@/integrations/supabase/client';

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
  status: 'pending' | 'accepted' | 'declined' | 'applied';
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
  applyToJob: (jobRoleId: string) => void;
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
    // Failed to load persisted skills, return empty array
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
    // Failed to load persisted settings, return defaults
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
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setIsAuthenticated(true);

          // Fetch Role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && mounted) {
            setUserRole(profile.role as UserRole);
          }
        }
      } catch (e) {
        // Error during auth initialization - user will remain unauthenticated
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUserRole(profile.role as UserRole);
        } else {
          const storedRole = localStorage.getItem('userRole') as UserRole || 'candidate';
          const newProfile = {
            id: session.user.id,
            role: storedRole,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url
          };

          const { error } = await supabase.from('profiles').insert(newProfile);
          if (error) {
            // Profile creation failed, but user is still authenticated
            setUserRole(storedRole);
          } else {
            setUserRole(storedRole);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // State Initialization
  const [skills, setSkillsState] = useState<Skill[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [events, setEventsState] = useState<Event[]>(mockEvents);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [settings, setSettingsState] = useState<UserSettings>(loadPersistedSettings);
  const [jobRoles, setJobRolesState] = useState<JobRole[]>([]);
  const [jobApplications, setJobApplicationsState] = useState<JobApplication[]>([]);

  // Fetch Data from Supabase
  React.useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        // Fetch Job Roles
        const { data: fetchedJobs, error: jobsError } = await supabase
          .from('job_roles')
          .select('*');

        if (fetchedJobs) {
          const formattedJobs = fetchedJobs.map(job => ({
            ...job,
            requiredSkills: (job.required_skills as any) || [],
            salaryRange: job.salary_range || '',
            postedAt: job.posted_at
          }));
          setJobRolesState(formattedJobs as unknown as JobRole[]);
        }

        // Fetch Skills (for current user)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: fetchedSkills, error: skillsError } = await supabase
            .from('candidate_skills')
            .select('*')
            .eq('user_id', user.id);

          if (fetchedSkills) {
            const mappedSkills = fetchedSkills.map(s => ({
              id: s.id,
              name: s.name,
              category: s.category || '',
              score: s.score || 0,
              maxScore: s.max_score || 100,
              targetScore: s.target_score || 80,
              assessedAt: s.assessed_at || undefined,
              status: s.status as 'pending' | 'assessed'
            }));
            setSkillsState(mappedSkills);
          }

          // Fetch Applications
          const { data: fetchedApps, error: appsError } = await supabase
            .from('job_applications')
            .select(`
              *,
              job_role:job_roles (*)
            `);

          if (fetchedApps) {
            const mappedApps: JobApplication[] = fetchedApps.map(app => ({
              id: app.id,
              jobRoleId: app.job_role_id,
              jobRole: {
                ...(app.job_role as any),
                requiredSkills: ((app.job_role as any)?.required_skills as any) || [],
                salaryRange: (app.job_role as any)?.salary_range || '',
                postedAt: (app.job_role as any)?.posted_at
              },
              candidateId: app.candidate_id,
              matchPercentage: app.match_percentage || 0,
              status: app.status as 'pending' | 'accepted' | 'declined' | 'applied',
              createdAt: app.created_at
            }));
            setJobApplicationsState(mappedApps);
          }
        }
      } catch (error) {
        // Error loading data from Supabase
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Wrappers to update state (Direct setters for now, logic handled in actions)
  const setJobRoles: React.Dispatch<React.SetStateAction<JobRole[]>> = setJobRolesState;
  const setJobApplications: React.Dispatch<React.SetStateAction<JobApplication[]>> = setJobApplicationsState;
  const setSkills: React.Dispatch<React.SetStateAction<Skill[]>> = setSkillsState;
  const setSettings: React.Dispatch<React.SetStateAction<UserSettings>> = setSettingsState;
  const setEvents: React.Dispatch<React.SetStateAction<Event[]>> = setEventsState;

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
    // Validate score range
    if (!isValidSkillScore(newScore)) {
      toast({
        title: 'Invalid score',
        description: 'Skill score must be between 0 and 100',
        variant: 'destructive'
      });
      return;
    }

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
  const addJobRole = async (jobRole: JobRole) => {
    setJobRoles((prev) => [...prev, jobRole]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('job_roles').insert({
          id: jobRole.id,
          recruiter_id: user.id,
          title: jobRole.title,
          company: jobRole.company,
          description: jobRole.description,
          location: jobRole.location,
          salary_range: jobRole.salaryRange,
          required_skills: jobRole.requiredSkills,
          posted_at: jobRole.postedAt
        });
        if (error) {
          toast({
            title: 'Error saving job',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Job posted',
            description: 'Your job role has been saved.',
          });
        }
      }
    } catch (e) {
      // Error adding job role
    }
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

  // Candidate applies to a job
  const applyToJob = async (jobRoleId: string) => {
    const jobRole = jobRoles.find(r => r.id === jobRoleId);
    if (!jobRole) return;

    // Calculate match
    const matchPercentage = calculateMatchPercentage(skills, jobRole.requiredSkills);

    // Create App object
    const newApplication: JobApplication = {
      id: crypto.randomUUID(),
      jobRoleId,
      jobRole,
      matchPercentage,
      status: 'applied', // Candidate initiated
      createdAt: new Date().toISOString(),
    };

    setJobApplications(prev => [...prev, newApplication]);

    // DB Insert
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('job_applications').insert({
          id: newApplication.id,
          job_role_id: jobRoleId,
          candidate_id: user.id,
          status: 'applied',
          match_percentage: matchPercentage,
          created_at: newApplication.createdAt
        });
        if (error) {
          toast({ title: 'Application failed', variant: 'destructive' });
        } else {
          toast({ title: 'Application sent!' });
        }
      }
    } catch (e) {
      // Error applying to job
    }

    // Also create a "Candidate" record visible to recruiter immediately (Optimistic UI only for now)
    // In real App, Recruiter fetches this from DB via 'job_applications' table join
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

  // Get candidates for a specific job role (Accepted OR Applied)
  const getAcceptedCandidatesForJob = (jobRoleId: string): Candidate[] => {
    // We want to show candidates who have applied OR been accepted for this job
    const relevantApps = jobApplications.filter(
      (app) => app.jobRoleId === jobRoleId && (app.status === 'accepted' || app.status === 'applied')
    );

    // Map applications to Candidate objects
    // In a real app, we'd fetch the candidate profile by candidateId.
    // Here, we'll reconstruct it from the application context or mock data.
    return relevantApps.map(app => ({
      id: app.candidateId || `candidate-${app.id}`,
      name: app.status === 'applied' ? 'New Applicant' : 'Matched Candidate', // Placeholder
      email: 'applicant@example.com',
      skills: app.jobRole.requiredSkills.map(s => ({
        id: s.skillId,
        name: s.name,
        score: 75,
        category: 'General',
        maxScore: 100,
        targetScore: s.minScore,
        status: 'assessed'
      })),
      readinessIndex: 80,
      matchPercentage: app.matchPercentage,
      acceptedAt: app.createdAt,
      location: 'Remote',
      // If it was the current user applying, we might have better data, but this is a tradeoff for the demo structure
      // To improve, applyToJob should store the full candidate object in the JobApplication or separate store
    }));
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
        applyToJob,
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
