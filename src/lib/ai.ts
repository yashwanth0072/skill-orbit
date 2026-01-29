
import Groq from "groq-sdk";
import { ResumeData } from "./resumeTypes";
import * as pdfjsLib from 'pdfjs-dist';

// Initialize Groq
// Note: In production, this key should be proxied or limited.
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

const MOCK_RESUME_DATA: ResumeData = {
    name: "Alex Chen (Mock)",
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

async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            text += strings.join(" ") + "\n";
        }
        return text;
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw new Error("Failed to extract text from PDF");
    }
}

export const processResumeWithAI = async (file: File): Promise<ResumeData> => {
    try {
        if (!API_KEY) {
            console.warn("No Groq API key found. Using Mock Data.");
            return MOCK_RESUME_DATA; // Fallback immediately if no key
        }

        const pdfText = await extractTextFromPDF(file);

        const prompt = `Analyze this resume text and extract the information in JSON format.
        Text:
        ${pdfText.substring(0, 15000)} {/* Limit context window if needed */}
        
        Required JSON Structure:
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
        Return ONLY the JSON object. Do not include markdown formatting or explanations.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192", // Fast and good enough
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content || "{}";
        return JSON.parse(content);

    } catch (error) {
        console.error("Groq Resume Processing Error:", error);
        console.warn("Falling back to MOCK DATA due to API Error");
        return MOCK_RESUME_DATA;
    }
};

export const generateQuizWithAI = async (skillName: string): Promise<QuizQuestion[]> => {
    try {
        if (!API_KEY) {
            console.warn("No Groq API key found. Using default empty/error will be handled by caller.");
            throw new Error("No API Key");
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

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content || "[]";
        // Parse the content. It might be wrapped in an object if response_format is json_object
        // But we asked for an array. Llama3 with json_object mode usually expects { something: ... }
        // Let's safe parse.

        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) return parsed;
            if (parsed.questions) return parsed.questions; // Handle { questions: [...] }
            return []; // Fallback
        } catch (e) {
            console.error("JSON Parse error", e);
            throw e;
        }

    } catch (error) {
        console.error("Groq Quiz Generation Error:", error);
        throw error;
    }
};
