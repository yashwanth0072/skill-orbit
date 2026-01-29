
import Groq from "groq-sdk";
import * as pdfjsLib from 'pdfjs-dist';
// Configure the worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

import { ResumeData } from "./resumeTypes";

// Initialize Groq
// Note: In production, this key should be proxied or limited.
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const groq = new Groq({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
});

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

const MOCK_RESUME_DATA: ResumeData = {
    name: "Alex Chen (Demo)",
    email: "alex.chen@example.com",
    location: "San Francisco, CA",
    summary: "Full Stack Developer with 4 years of experience building scalable web applications. Passionate about AI and user experience.",
    experience: [
        {
            title: "Senior Frontend Engineer",
            company: "TechFlow Solutions",
            duration: "2022 - Present",
            description: "Led the migration of legacy monolith to micro-frontends using React and TypeScript."
        },
        {
            title: "Web Developer",
            company: "Creative Digital",
            duration: "2020 - 2022",
            description: "Developed responsive websites and e-commerce platforms for various clients."
        }
    ],
    education: [
        {
            degree: "B.S. Computer Science",
            institution: "State University",
            year: "2020"
        }
    ],
    extractedSkills: [
        { name: "React", category: "Frontend", yearsOfExperience: 4 },
        { name: "TypeScript", category: "Frontend", yearsOfExperience: 3 },
        { name: "Node.js", category: "Backend", yearsOfExperience: 2 },
        { name: "Tailwind CSS", category: "Frontend", yearsOfExperience: 3 },
        { name: "PostgreSQL", category: "Database", yearsOfExperience: 2 }
    ]
};

const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
};

export const processResumeWithAI = async (file: File): Promise<ResumeData> => {
    try {
        console.log("Starting resume processing with Groq...");

        if (!API_KEY) {
            console.error("CRITICAL: Groq API Key is MISSING. Please check VITE_GROQ_API_KEY in .env");
            console.warn("Falling back to mock data");
            return MOCK_RESUME_DATA;
        } else {
            console.log("Groq API Key detected");
        }

        console.log("Extracting text from PDF...");
        const text = await extractTextFromPDF(file);
        console.log("PDF text extracted, length:", text.length);

        // Truncate text if it's too long (approximating token limit safety)
        const truncatedText = text.slice(0, 20000);

        const prompt = `Analyze this resume text and extract the following information in JSON format:
        
        RESUME TEXT:
        ${truncatedText}

        REQUIRED JSON STRUCTURE:
        {
          "name": "Full name",
          "email": "Email",
          "phone": "Phone",
          "location": "City, State",
          "summary": "Brief summary",
          "experience": [{ "title": "", "company": "", "duration": "", "description": "" }],
          "education": [{ "degree": "", "institution": "", "year": "" }],
          "extractedSkills": [{ "name": "Skill name", "category": "Category", "yearsOfExperience": number }]
        }
        
        Return ONLY the JSON object. Do not include markdown formatting (like \`\`\`json).`;

        console.log("Sending request to Groq...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that extracts structured data from resumes. You always return valid JSON."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-70b-8192",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        console.log("Groq response received:", content.substring(0, 100) + "...");
        return JSON.parse(content);

    } catch (error) {
        console.error("AI Resume Processing Error:", error);
        if (error instanceof Error) {
            console.error("Error Details:", error.message, error.stack);
        }
        console.warn("Falling back to MOCK DATA due to API/Parsing Error");
        return MOCK_RESUME_DATA;
    }
};

export const generateQuizWithAI = async (skillName: string): Promise<QuizQuestion[]> => {
    try {
        if (!API_KEY) {
            throw new Error("Groq API key is missing");
        }

        const prompt = `Generate 5 multiple-choice questions for the skill: "${skillName}".
        Difficulty: Intermediate.
        
        Format the output as a JSON array of objects with this structure:
        [
          {
            "question": "The question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0 // Index of the correct option (0-3)
          }
        ]
        
        Return ONLY the JSON array.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a quiz generator. You always return valid JSON arrays."
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "llama3-70b-8192",
            temperature: 0.5,
            response_format: { type: "json_object" },
        });

        const content = chatCompletion.choices[0]?.message?.content || "[]";

        // Handle case where model returns an object wrapping the array (common with response_format: json_object)
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            return parsed;
        } else if (parsed.questions && Array.isArray(parsed.questions)) {
            return parsed.questions;
        } else {
            // Fallback: search for array in values
            const val = Object.values(parsed).find(v => Array.isArray(v));
            if (val) return val as QuizQuestion[];
            throw new Error("Could not find array in response");
        }

    } catch (error) {
        console.error("AI Quiz Generation Error:", error);
        throw error;
    }
};
