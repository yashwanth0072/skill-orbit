import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedSkill {
  name: string;
  category: string;
  yearsOfExperience?: number;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  extractedSkills?: ExtractedSkill[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ success: false, error: 'Only PDF files are supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing resume: ${file.name}, size: ${file.size} bytes`);

    // Read file as base64 for AI processing - use Deno's base64 encoder to avoid stack overflow
    const arrayBuffer = await file.arrayBuffer();
    const base64 = base64Encode(arrayBuffer);

    // Use Lovable AI Gateway to extract resume data
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this PDF resume and extract the following information in JSON format:
{
  "name": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "location": "City, State/Country",
  "summary": "Professional summary or objective (1-2 sentences)",
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Start - End dates",
      "description": "Brief description of responsibilities"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School/University name",
      "year": "Graduation year"
    }
  ],
  "extractedSkills": [
    {
      "name": "Skill name",
      "category": "One of: Programming, Frontend, Backend, Database, DevOps, Cloud, Design, Soft Skills, Tools, Other",
      "yearsOfExperience": null or number if mentioned
    }
  ]
}

Return ONLY the JSON object, no markdown formatting or code blocks. Extract all skills mentioned including programming languages, frameworks, tools, and soft skills.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI processing failed: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    console.log('AI Response received');

    const content = aiResult.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response
    let resumeData: ResumeData;
    try {
      // Clean up the response if it has markdown formatting
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      resumeData = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse resume data from AI response');
    }

    console.log(`Extracted ${resumeData.extractedSkills?.length || 0} skills`);

    return new Response(
      JSON.stringify({ success: true, data: resumeData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Resume processing error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process resume' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
