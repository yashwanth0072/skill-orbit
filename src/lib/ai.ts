
import Groq from "groq-sdk";
import { ResumeData } from "./resumeTypes";

// Initialize Groq
// Note: In production, this key should be proxied or limited.
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

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



const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1
    },
    {
        question: "What is the purpose of TypeScript interfaces?",
        options: ["To run code at runtime", "To define contracts for shapes of data", "To compile Java code", "To optimize database queries"],
        correctAnswer: 1
    },
    {
        question: "What does 'prop drilling' refer to?",
        options: ["Passing props deeply through components", "Drilling holes in hardware", "Using properties in CSS", "Creating new components"],
        correctAnswer: 0
    },
    {
        question: "In Tailwind CSS, how do you make text center aligned?",
        options: ["text-middle", "align-center", "text-center", "font-center"],
        correctAnswer: 2
    },
    {
        question: "What is the virtual DOM?",
        options: ["A video game level", "A lightweight copy of the real DOM", "A browser extension", "A database for HTML"],
        correctAnswer: 1
    }
];

export const processResumeWithAI = async (file: File): Promise<ResumeData> => {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_RESUME_DATA;
};

export const generateQuizWithAI = async (skillName: string): Promise<QuizQuestion[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_QUIZ_QUESTIONS;
};
