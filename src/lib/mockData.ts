// Mock data for Skill Orbith platform

export interface Skill {
  id: string;
  name: string;
  category: string;
  score: number;
  maxScore: number;
  targetScore: number;
  assessedAt?: string;
  status?: 'pending' | 'assessed';
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  skills: { name: string; weight: number; matched: boolean }[];
  postedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  salaryRange?: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'hackathon' | 'bootcamp' | 'workshop';
  description: string;
  date: string;
  location: string;
  relevantSkills: string[];
  skillGapMatch: number;
  completed: boolean;
  link?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
  readinessIndex: number;
  matchPercentage: number;
  acceptedAt?: string;
  location: string;
}

export interface JobRole {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: { skillId: string; name: string; weight: number; minScore: number }[];
  location: string;
  salaryRange: string;
  postedAt: string;
}

// Candidate mock data
export const mockSkills: Skill[] = [
  { id: '1', name: 'JavaScript', category: 'Programming', score: 85, maxScore: 100, targetScore: 80, assessedAt: '2024-01-15' },
  { id: '2', name: 'TypeScript', category: 'Programming', score: 78, maxScore: 100, targetScore: 75, assessedAt: '2024-01-15' },
  { id: '3', name: 'React', category: 'Frontend', score: 82, maxScore: 100, targetScore: 85, assessedAt: '2024-01-14' },
  { id: '4', name: 'Node.js', category: 'Backend', score: 65, maxScore: 100, targetScore: 75, assessedAt: '2024-01-13' },
  { id: '5', name: 'System Design', category: 'Architecture', score: 58, maxScore: 100, targetScore: 70, assessedAt: '2024-01-12' },
  { id: '6', name: 'Data Structures', category: 'Fundamentals', score: 72, maxScore: 100, targetScore: 80, assessedAt: '2024-01-10' },
  { id: '7', name: 'APIs & REST', category: 'Backend', score: 80, maxScore: 100, targetScore: 75, assessedAt: '2024-01-10' },
  { id: '8', name: 'Git & Version Control', category: 'Tools', score: 90, maxScore: 100, targetScore: 80, assessedAt: '2024-01-08' },
];

export const mockSkillGaps: SkillGap[] = [
  { skillId: '5', skillName: 'System Design', currentScore: 58, requiredScore: 70, gap: 12, priority: 'high' },
  { skillId: '4', skillName: 'Node.js', currentScore: 65, requiredScore: 75, gap: 10, priority: 'high' },
  { skillId: '6', skillName: 'Data Structures', currentScore: 72, requiredScore: 80, gap: 8, priority: 'medium' },
  { skillId: '3', skillName: 'React', currentScore: 82, requiredScore: 85, gap: 3, priority: 'low' },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    matchPercentage: 92,
    skills: [
      { name: 'JavaScript', weight: 25, matched: true },
      { name: 'React', weight: 30, matched: true },
      { name: 'TypeScript', weight: 25, matched: true },
      { name: 'System Design', weight: 20, matched: false },
    ],
    postedAt: '2024-01-18',
    status: 'pending',
    salaryRange: '$150k - $180k',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    matchPercentage: 85,
    skills: [
      { name: 'JavaScript', weight: 20, matched: true },
      { name: 'Node.js', weight: 30, matched: false },
      { name: 'React', weight: 25, matched: true },
      { name: 'APIs & REST', weight: 25, matched: true },
    ],
    postedAt: '2024-01-17',
    status: 'accepted',
    salaryRange: '$120k - $150k',
  },
  {
    id: '3',
    title: 'React Developer',
    company: 'DigitalAgency',
    location: 'New York, NY',
    matchPercentage: 88,
    skills: [
      { name: 'React', weight: 40, matched: true },
      { name: 'JavaScript', weight: 30, matched: true },
      { name: 'TypeScript', weight: 30, matched: true },
    ],
    postedAt: '2024-01-16',
    status: 'declined',
    salaryRange: '$110k - $140k',
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'System Design Masterclass',
    type: 'workshop',
    description: 'Deep dive into scalable system architecture patterns and best practices.',
    date: '2024-02-15',
    location: 'Online',
    relevantSkills: ['System Design', 'Architecture'],
    skillGapMatch: 95,
    completed: false,
    link: '#',
  },
  {
    id: '2',
    title: 'Node.js Backend Bootcamp',
    type: 'bootcamp',
    description: '4-week intensive program covering advanced Node.js concepts and patterns.',
    date: '2024-02-01',
    location: 'San Francisco, CA',
    relevantSkills: ['Node.js', 'APIs & REST', 'Backend'],
    skillGapMatch: 88,
    completed: false,
    link: '#',
  },
  {
    id: '3',
    title: 'HackReact 2024',
    type: 'hackathon',
    description: '48-hour hackathon focused on building innovative React applications.',
    date: '2024-03-10',
    location: 'Austin, TX',
    relevantSkills: ['React', 'JavaScript', 'TypeScript'],
    skillGapMatch: 72,
    completed: false,
    link: '#',
  },
  {
    id: '4',
    title: 'Data Structures Deep Dive',
    type: 'workshop',
    description: 'Comprehensive workshop on algorithms and data structures for interviews.',
    date: '2024-01-28',
    location: 'Online',
    relevantSkills: ['Data Structures', 'Algorithms'],
    skillGapMatch: 85,
    completed: true,
    link: '#',
  },
];

// Recruiter mock data
export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@email.com',
    skills: mockSkills,
    readinessIndex: 78,
    matchPercentage: 92,
    acceptedAt: '2024-01-18',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.c@email.com',
    skills: [
      { id: '1', name: 'JavaScript', category: 'Programming', score: 90, maxScore: 100, targetScore: 80 },
      { id: '3', name: 'React', category: 'Frontend', score: 88, maxScore: 100, targetScore: 85 },
      { id: '5', name: 'System Design', category: 'Architecture', score: 75, maxScore: 100, targetScore: 70 },
    ],
    readinessIndex: 85,
    matchPercentage: 95,
    acceptedAt: '2024-01-17',
    location: 'Remote',
  },
  {
    id: '3',
    name: 'Michael Park',
    email: 'michael.p@email.com',
    skills: [
      { id: '1', name: 'JavaScript', category: 'Programming', score: 82, maxScore: 100, targetScore: 80 },
      { id: '2', name: 'TypeScript', category: 'Programming', score: 85, maxScore: 100, targetScore: 75 },
      { id: '4', name: 'Node.js', category: 'Backend', score: 78, maxScore: 100, targetScore: 75 },
    ],
    readinessIndex: 80,
    matchPercentage: 88,
    acceptedAt: '2024-01-16',
    location: 'New York, NY',
  },
];

export const mockJobRoles: JobRole[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Your Company',
    description: 'We are looking for a skilled Software Engineer to join our growing team.',
    requiredSkills: [
      { skillId: '1', name: 'JavaScript', weight: 25, minScore: 80 },
      { skillId: '3', name: 'React', weight: 30, minScore: 75 },
      { skillId: '2', name: 'TypeScript', weight: 20, minScore: 70 },
      { skillId: '5', name: 'System Design', weight: 15, minScore: 60 },
      { skillId: '6', name: 'Data Structures', weight: 10, minScore: 70 },
    ],
    location: 'San Francisco, CA / Remote',
    salaryRange: '$130k - $160k',
    postedAt: '2024-01-15',
  },
];

// Assessment questions mock
export interface AssessmentQuestion {
  id: string;
  skillId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const mockAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    skillId: '1',
    question: 'What is the output of: console.log(typeof null)?',
    options: ['null', 'undefined', 'object', 'string'],
    correctAnswer: 2,
  },
  {
    id: '2',
    skillId: '1',
    question: 'Which method creates a new array with the results of calling a function on every element?',
    options: ['forEach()', 'filter()', 'map()', 'reduce()'],
    correctAnswer: 2,
  },
  {
    id: '3',
    skillId: '3',
    question: 'In React, what hook is used to perform side effects?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 1,
  },
  {
    id: '4',
    skillId: '3',
    question: 'What is the purpose of React.memo()?',
    options: [
      'To create memoized values',
      'To prevent unnecessary re-renders',
      'To store component state',
      'To handle async operations',
    ],
    correctAnswer: 1,
  },
  {
    id: '5',
    skillId: '5',
    question: 'Which scaling approach adds more servers to handle load?',
    options: ['Vertical scaling', 'Horizontal scaling', 'Diagonal scaling', 'Linear scaling'],
    correctAnswer: 1,
  },
];

// Helper functions
export function calculateReadinessIndex(skills: Skill[]): number {
  if (skills.length === 0) return 0;
  const totalScore = skills.reduce((acc, skill) => acc + (skill.score / skill.maxScore), 0);
  return Math.round((totalScore / skills.length) * 100);
}

export function calculateMatchPercentage(candidateSkills: Skill[], requiredSkills: { name: string; weight: number; minScore: number }[]): number {
  let totalWeight = 0;
  let matchedWeight = 0;

  requiredSkills.forEach((required) => {
    totalWeight += required.weight;
    const candidateSkill = candidateSkills.find((s) => s.name === required.name);
    if (candidateSkill && candidateSkill.score >= required.minScore) {
      matchedWeight += required.weight * (candidateSkill.score / 100);
    }
  });

  return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;
}
