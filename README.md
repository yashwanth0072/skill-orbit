# Skill Orbit 🚀

**Skill Orbit** is a futuristic recruitment platform built for the **Fortex36 Hackathon**. It flips the traditional hiring model on its head with "Reverse Hiring," where companies apply to candidates based on verified skills, not just static resumes.

> **Note**: This project was built as a prototype for a hackathon and uses browser storage for demonstration purposes. It is not licensed for commercial use.

---

## 🌟 Key Features

### 1. Reverse Hiring Model
- Candidates showcase their verified skills and readiness.
- Recruiters browse top talent and "apply" to candidates with job opportunities.

### 2. AI-Powered Intelligence (Gemini)
- **Smart Resume Parsing**: Upload a PDF resume, and our AI (Google Gemini) extracts skills, categorizes them, and builds your profile instantly.
- **Adaptive Assessments**: Take AI-generated quizzes to verify your skills. The questions adapt to the specific skill you are testing.
- **Skill Gap Analysis**: The system identifies missing skills for your target roles and visualizes your "Readiness Index."

### 3. Dual Dashboards
- **Candidate Portal**: Track applications, view analytics on your profile, and search for learning events/hackathons to upskill.
- **Recruiter Portal**: Post jobs, manage candidate pipelines, and configure company settings.

### 4. Interactive UX
- Built with modern animations (Framer Motion) and a sleek, glassmorphic design system.
- Real-time updates for job applications and status changes.

---

## 🛠️ Tech Stack

### Frontend & UI
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI Components)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

### Backend & Services
- **Firebase Authentication** (Google Sign-In & Email/Password)
- **Google Generative AI SDK** (Gemini 1.5 Flash for Resume/Quiz)
- **Local Storage** (For hackathon demo persistence without server latency)

### Tools
- **React Router** (Navigation)
- **React Hook Form + Zod** (Form Validation)
- **TanStack Query** (State Management)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Google Cloud API Key (for Gemini)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skill-orbit.git
cd skill-orbit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your keys:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```
*(Note: Firebase config is currently embedded for the demo, but you can swap it for your own project in `src/integrations/firebase/config.ts`)*

### 4. Run the Development Server
```bash
npm run dev
```
The app will open at `http://localhost:3000`.

---

## 🎮 How to Demo

The app supports two user roles: **Candidate** and **Recruiter**.

### Scenario A: The Candidate Experience
1.  **Login** as a Candidate.
2.  **Upload Resume**: Drag & Drop your PDF resume on the Dashboard. Watch the AI extract your skills.
3.  **Take Quiz**: Click "Take Assessment" to verify a skill.
4.  **View Opportunities**: Check the "Opportunities" tab to see jobs posted by recruiters.
5.  **Apply**: Click "Apply" on a job.

### Scenario B: The Recruiter Experience
1.  **Logout** and Login as a **Recruiter**.
2.  **Post a Job**: Go to "Job Roles" -> "Post New Role". Add skills and salary info.
3.  **Check Applicants**: Go to "Candidates" to see who applied (or who matches your criteria).
4.  **Settings**: Visit "Settings" to configure your company profile.

---

## 📄 License
This project is open-source for educational and hackathon purposes. No specific license is attached.
