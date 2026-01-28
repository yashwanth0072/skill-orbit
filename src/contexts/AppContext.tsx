import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Skill,
  Opportunity,
  Event,
  mockSkills,
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('candidate');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [settings, setSettings] = useState<UserSettings>({
    reverseHiringEnabled: true,
    emailNotifications: true,
    opportunityAlerts: true,
    eventNotifications: true,
  });

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
