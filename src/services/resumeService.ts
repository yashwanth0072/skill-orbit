// Resume processing service using Lovable Cloud backend

import { supabase } from '@/integrations/supabase/client';
import { ResumeData } from '@/lib/resumeTypes';

export interface ResumeResponse {
  success: boolean;
  data?: ResumeData;
  error?: string;
}

export const processResume = async (file: File): Promise<ResumeResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    // Call the edge function
    const { data, error } = await supabase.functions.invoke('process-resume', {
      body: formData,
    });

    if (error) {
      console.error('Edge function error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process resume',
      };
    }

    if (!data?.success) {
      return {
        success: false,
        error: data?.error || 'Resume processing failed',
      };
    }

    return {
      success: true,
      data: data.data as ResumeData,
    };
  } catch (error) {
    console.error('Resume processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process resume',
    };
  }
};
