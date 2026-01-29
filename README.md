# 🚀 Skill Orbit
> **The Future of Recruitment: AI-Driven Reverse Hiring**

[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5_Flash-orange?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)

**Skill Orbit** redefines the hiring landscape for the **Fortex36 Hackathon**. We flip the script with a **"Reverse Hiring"** model where companies apply to candidates based on verified skills, adaptive assessments, and AI-synthesized profiles.

> [!NOTE] 
> **Prototype Notice**: This application was developed as a hackathon entry. It utilizes browser storage for demonstration purposes and is intended as a proof-of-concept.

---

## 🌟 Key Features

### 1. Reverse Hiring Paradigm
Instead of candidates spamming applications, **Skill Orbit** empowers them.
- **Verified Profiles**: Candidates focus on showcasing proven skills.
- **Recruiter Outreach**: Companies browse top talent and "apply" to *them* with tailored opportunities.

### 2. Intelligent Profile Synthesis (Powered by Gemini)
Leveraging Google's Gemini 1.5 Flash model for deep understanding:
- **Instant Resume Parsing**: Drag & drop a PDF to instantly extract skills, experience, and projects into a structured profile.
- **Adaptive Skill Assessments**: Dynamic AI-generated quizzes that adapt complexity based on the candidate's answers.
- **Readiness Index**: Visual "Skill Gap Analysis" to show candidates exactly what they need for their dream roles.

### 3. Integrated Ecosystem
- **Candidate Portal**: A personal command center for tracking applications, viewing profile analytics, and discovering hackathons/events.
- **Recruiter Dashboard**: sophisticated tools for posting jobs, managing candidate pipelines, and configuring company branding.

### 4. Premium User Experience
- **Glassmorphic Design**: A sleek, modern aesthetic using `shadcn/ui` and custom glassmorphism.
- **Fluid Animations**: Powered by `Framer Motion` for seamless state transitions and interactions.
- **Real-time Feedback**: Instant updates for application statuses and job matches.

---

## 🛠️ Technology Stack

### Frontend Core
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
- **Animation**: Framer Motion

### AI & Services
- **Generative AI**: Google Gemini SDK (Gemini 1.5 Flash)
- **Authentication**: Firebase Auth (Google Sign-In + Email/Password)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

---

## 🚀 Getting Started

Follow these steps to deploy the local development environment.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google Cloud API Key (for Gemini integration)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/skill-orbit.git
    cd skill-orbit
    ```

2.  **Install Application Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_google_gemini_api_key
    ```
    *(Note: Firebase configuration is currently embedded for demo ease-of-use. For production, update `src/integrations/firebase/config.ts`)*

4.  **Launch Development Server**
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:3000`.

---

## 🎮 Demo Walkthrough

The application demonstrates two distinct workflows:

### Scenario A: The Candidate
1.  **Onboarding**: Log in and access the Candidate Dashboard.
2.  **Profile Builder**: Upload a PDF resume. Watch Gemini analyze and populate your skills instantly.
3.  **Validation**: Navigate to "Assessments" and take an AI-generated quiz to verify a specific skill.
4.  **Discovery**: Browse the "Opportunities" tab to find recruiter outreach and relevant job postings.
5.  **Action**: Apply to interested roles or register for suggested hackathons.

### Scenario B: The Recruiter
1.  **Switch Role**: Log out and authenticate as a Recruiter.
2.  **Talent Acquisition**: Browse the "Candidates" pool to find users with verified skills matching your needs.
3.  **Job Management**: Navigate to "Job Roles" to create new listings with required skill sets and salary ranges.
4.  **Organization**: Use "Settings" to customize your company profile and hiring preferences.

---

## 📄 License

This project is open-source and created for educational purposes as part of the Fortex36 Hackathon.
