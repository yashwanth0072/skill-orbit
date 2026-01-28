// n8n Webhook Service for resume parsing and other backend operations

import { ResumeData } from '@/lib/resumeTypes';

// n8n webhook URL - exposed via ngrok
let RESUME_WEBHOOK_URL: string | null = 'http://localhost:5678/webhook-test/upload-resume';

export const setResumeWebhookUrl = (url: string) => {
  RESUME_WEBHOOK_URL = url;
};

export const getResumeWebhookUrl = (): string | null => {
  return RESUME_WEBHOOK_URL;
};

export const isWebhookConfigured = (): boolean => {
  return RESUME_WEBHOOK_URL !== null && RESUME_WEBHOOK_URL.length > 0;
};

export interface WebhookResponse {
  success: boolean;
  data?: ResumeData;
  error?: string;
}

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:application/pdf;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadResumeToN8n = async (file: File): Promise<WebhookResponse> => {
  if (!RESUME_WEBHOOK_URL) {
    return {
      success: false,
      error: 'Webhook URL not configured. Please set up your n8n webhook URL first.',
    };
  }

  try {
    const base64Content = await fileToBase64(file);
    
    const response = await fetch(RESUME_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        content: base64Content,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data as ResumeData,
    };
  } catch (error) {
    console.error('Resume upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload resume',
    };
  }
};

// Mock function for testing without n8n
export const mockResumeProcessing = async (file: File): Promise<WebhookResponse> => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock extracted data
  return {
    success: true,
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Experienced software engineer with 5+ years in full-stack development.',
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          duration: '2021 - Present',
          description: 'Led frontend development team, implemented React applications.',
        },
        {
          title: 'Software Developer',
          company: 'StartupXYZ',
          duration: '2019 - 2021',
          description: 'Full-stack development with Node.js and React.',
        },
      ],
      education: [
        {
          degree: 'B.S. Computer Science',
          institution: 'University of California',
          year: '2019',
        },
      ],
      extractedSkills: [
        { name: 'JavaScript', category: 'Programming', yearsOfExperience: 5 },
        { name: 'TypeScript', category: 'Programming', yearsOfExperience: 3 },
        { name: 'React', category: 'Frontend', yearsOfExperience: 4 },
        { name: 'Node.js', category: 'Backend', yearsOfExperience: 3 },
        { name: 'System Design', category: 'Architecture', yearsOfExperience: 2 },
      ],
    },
  };
};
