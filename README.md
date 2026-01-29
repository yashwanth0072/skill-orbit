# 🚀 Skill Orbit

> **The Future of Recruitment: AI-Driven Reverse Hiring**
>
> **🌐 Live Demo**: [https://skill-orbit-tau.vercel.app](https://skill-orbit-tau.vercel.app)

[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5_Flash-orange?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)

---

## 📋 About

**Skill Orbit** revolutionizes the traditional hiring process by introducing a **"Reverse Hiring"** paradigm. Instead of candidates endlessly searching and applying to jobs, companies discover and apply to candidates based on verified skills, adaptive assessments, and AI-synthesized profiles.

The platform bridges the gap between talent and opportunity through an intelligent, skill-first matching system that empowers both candidates and recruiters to connect meaningfully and efficiently.

---

## 🌟 Key Features

### 👤 For Candidates

- **Skill-First Profile**: Build a profile based on verified skills rather than traditional resume keywords
- **Adaptive Assessments**: Take role-specific skill assessments to validate your expertise  
- **Smart Matching**: Receive notifications for opportunities that match your skill level and interests
- **Skill Gap Analysis**: Visualize exactly what skills you need to develop for your dream roles
- **Career Timeline**: Track your progress, completed assessments, and opportunities in one place
- **Application Management**: View all outreach from companies and manage your applications seamlessly

### 👔 For Recruiters

- **Talent Discovery**: Browse verified candidates filtered by skills and experience
- **Job Posting**: Create and manage job listings with specific skill requirements
- **Direct Outreach**: Apply directly to candidates with tailored job opportunities  
- **Candidate Pipeline**: Track applicants, their skills, and interview progress
- **Real-time Updates**: Instant notifications on candidate interest and application status
- **Analytics Dashboard**: Insights into hiring metrics and candidate quality

### 🔧 Platform Features

- **Glassmorphic Design**: Modern, sleek UI with frosted glass effects and smooth transitions
- **Fluid Animations**: Enhanced user experience powered by Framer Motion
- **Real-time Database**: Instant synchronization across all users via Supabase
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices
- **Dark Mode Support**: Comfortable viewing in any lighting condition
- **AI-Powered Resume Parsing**: (Demo) Intelligent extraction of skills from PDF resumes

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 18.x |
| **TypeScript** | Type Safety | 5.0 |
| **Vite** | Build Tool & Dev Server | 5.0+ |
| **Tailwind CSS** | Utility-First CSS | 3.4 |
| **shadcn/ui** | Component Library | Latest |
| **Radix UI** | Accessible Components | Latest |
| **Framer Motion** | Animation Library | Latest |
| **React Router** | Client-Side Routing | 6.x |
| **React Hook Form** | Form Management | Latest |
| **TanStack Query** | Server State Management | 5.x |

### Backend & Services
| Technology | Purpose |
|-----------|---------|
| **Supabase** | PostgreSQL Database + Auth |
| **Google Gemini 1.5 Flash** | AI-Powered Skills Analysis |
| **Firebase** | Authentication Support |

### UI & UX
| Technology | Purpose |
|-----------|---------|
| **Lucide React** | Icon Library |
| **Sonner** | Toast Notifications |
| **Recharts** | Data Visualization |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code Linting |
| **Vitest** | Unit Testing |
| **PostCSS** | CSS Processing |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- A **Supabase** project ([Create free](https://supabase.com))
- **Google Cloud API Key** for Gemini integration ([Get API Key](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/skill-orbit.git
   cd skill-orbit
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_gemini_api_key
   ```
   
   **Where to find these:**
   - **Supabase URL & Key**: Supabase Dashboard → Settings → API
   - **Gemini API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Database Setup**
   
   Execute the SQL schema in your Supabase project:
   
   1. Go to Supabase Dashboard → SQL Editor
   2. Open `supabase/migrations/20240129_initial_schema.sql`
   3. Copy and paste the entire SQL content
   4. Execute the migration

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   
   Access the application at `http://localhost:5173`

---

## 📚 Project Structure

```
skill-orbit/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout components (Sidebar, Dashboard)
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Page components
│   │   ├── candidate/      # Candidate dashboard pages
│   │   └── recruiter/      # Recruiter dashboard pages
│   ├── contexts/           # React Context for state management
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and constants
│   ├── services/           # API and service integrations
│   ├── integrations/       # Third-party integrations
│   │   ├── firebase/       # Firebase configuration
│   │   └── supabase/       # Supabase configuration
│   └── main.tsx            # Application entry point
├── supabase/
│   ├── migrations/         # Database schema migrations
│   └── functions/          # Supabase Edge Functions
├── public/                 # Static assets
└── package.json            # Project dependencies
```

---

## 🎮 How It Works

### Candidate Journey

1. **Sign Up**: Create an account with email or OAuth providers
2. **Build Profile**: Upload your resume to automatically extract skills
3. **Take Assessments**: Complete skill-specific assessments to validate expertise
4. **View Opportunities**: Browse companies interested in your profile
5. **Connect**: Accept or decline opportunities from recruiters
6. **Track Progress**: Monitor your skill development and career timeline

### Recruiter Journey

1. **Sign Up**: Register as a recruiter with company details
2. **Post Roles**: Create job listings with specific skill requirements
3. **Browse Talent**: Discover candidates filtered by skills and experience
4. **Apply to Candidates**: Send tailored opportunities directly to candidates
5. **Manage Pipeline**: Track candidate responses and interview progress
6. **Analytics**: View hiring metrics and candidate quality insights

---

## 🔄 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Watch mode for tests
npm run test:watch
```
---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

The project is optimized for **Vercel** deployment:

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and import your GitHub repository
   - Select the project root directory
   - Click "Deploy"

3. **Set Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add the following variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
     - `VITE_GROQ_API_KEY`

4. **Redeploy** after setting environment variables

### Deploy to Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Set the same VITE_* variables in Netlify dashboard

---

## 📊 Key Performance Features

- **Optimized Build**: Vite provides lightning-fast builds with minimal bundle size
- **Code Splitting**: Automatic route-based code splitting for better performance
- **Real-time Sync**: Supabase Realtime ensures instant data updates
- **Responsive Images**: Optimized image loading for all device sizes
- **Dark Mode**: System preference detection for theme switching

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🆘 Troubleshooting

### Issue: "Cannot find module '@/...'?"
- **Solution**: The `@` alias is configured in `tsconfig.app.json` and `vite.config.ts`. Ensure your IDE recognizes it or restart your dev server.

### Issue: Supabase connection error?
- **Solution**: Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct in your `.env.local` file.

### Issue: Gemini API errors?
- **Solution**: Ensure your `VITE_GROQ_API_KEY` is valid and has sufficient API quota in Google Cloud Console.

### Issue: Build fails with TypeScript errors?
- **Solution**: Run `npm run lint` to identify issues, then fix as needed.

---

## 📄 License

This project is open-source and created for educational purposes. No specific license is attached to this project.

---

## 🙏 Acknowledgments

- **Vercel** for providing excellent deployment platform
- **Supabase** for real-time database and authentication
- **Google Gemini** for AI capabilities
- **shadcn/ui** and **Radix UI** for accessible component libraries
- **Framer Motion** for smooth animations
- All contributors and community members supporting this project

---

## 📞 Support

For questions, issues, or feedback:

1. **Open an Issue**: [GitHub Issues](https://github.com/yourusername/skill-orbit/issues)
2. **Email**: [contact info if available]
3. **Visit**: [https://skill-orbit-tau.vercel.app](https://skill-orbit-tau.vercel.app)

---

**Made with ❤️ for the Hackathon Community**
