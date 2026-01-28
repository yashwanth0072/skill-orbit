
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeData } from "./resumeTypes";

// Initialize Gemini
// Note: In production, this key should be proxied or limited.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAJnblnUdIl6jSXbOG4CDpGaG8sY58AD7c";
const genAI = new GoogleGenerativeAI(API_KEY);

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

export const processResumeWithGemini = async (file: File): Promise<ResumeData> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data URL prefix (e.g., "data:application/pdf;base64,")
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
        });

        const prompt = `Analyze this PDF resume and extract the following information in JSON format:
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
Return ONLY the JSON object.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "application/pdf",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanText);

    } catch (error) {
        console.error("Gemini Resume Processing Error:", error);
        throw new Error("Failed to process resume with AI");
    }
};

export const generateQuizWithGemini = async (skillName: string): Promise<QuizQuestion[]> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanText);

    } catch (error) {
        console.error("Gemini Quiz Generation Error:", error);
        // Fallback or rethrow
        throw error;
    }
};
