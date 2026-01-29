# 🚀 Skill Orbit
> **The Future of Recruitment: AI-Driven Reverse Hiring**

[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5_Flash-orange?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)

**Skill Orbit** redefines the hiring landscape. We flip the script with a **"Reverse Hiring"** model where companies apply to candidates based on verified skills, adaptive assessments, and AI-synthesized profiles.

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
- **Real-time Data**: Powered by **Supabase Realtime** for instant updates on applications and statuses.

---

## 🛠️ Technology Stack

### Frontend Core
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
- **Animation**: Framer Motion

### Backend & AI
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Generative AI**: Google Gemini SDK (Gemini 1.5 Flash)
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React

---

## 🚀 Getting Started

Follow these steps to deploy the local development environment.

### Prerequisites
- Node.js (v18+)
- Supabase Project (Free Tier)
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
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    VITE_GROQ_API_KEY=your_gemini_or_groq_api_key
    ```

4.  **Database Setup (Important)**
    To create the necessary tables, copy the SQL code from `supabase/migrations/20240129_initial_schema.sql` and run it in your **Supabase Dashboard > SQL Editor**.

5.  **Launch Development Server**
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:5173`.

---

## 🌐 Deployment

This project is optimized for deployment on **Vercel** or **Netlify**.

### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
Ensure you add the `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_GROQ_API_KEY` to your deployment provider's environment variable settings.

---

## 🎮 Demo Walkthrough

### Scenario A: The Candidate
1.  **Onboarding**: Log in via Google or Email.
2.  **Profile Builder**: Upload a PDF resume. Watch AI analyze and populate your skills instantly.
3.  **Validation**: Take an AI-generated quiz to verify a specific skill.
4.  **Discovery**: Browse "Opportunities" to find recruiter outreach.

### Scenario B: The Recruiter
1.  **Switch Role**: Log in as a Recruiter.
2.  **Talent Acquisition**: Browse the "Candidates" pool to find users with verified skills.
3.  **Job Management**: Post new job listings. these are saved to the database in real-time.

---

## 📄 License
This project is open-source and created for educational purposes as part of the Fortex36 Hackathon.
