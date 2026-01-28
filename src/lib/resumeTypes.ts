// Resume data types for n8n integration

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience?: WorkExperience[];
  education?: Education[];
  extractedSkills?: ExtractedSkill[];
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ExtractedSkill {
  name: string;
  category: string;
  yearsOfExperience?: number;
}

export interface ResumeUploadState {
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
  resumeData: ResumeData | null;
}
