import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import { SidebarProvider } from "./contexts/SidebarContext";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Candidate Pages
import CandidateDashboard from "./pages/candidate/Dashboard";
import Assessments from "./pages/candidate/Assessments";
import Opportunities from "./pages/candidate/Opportunities";
import Events from "./pages/candidate/Events";
import Progress from "./pages/candidate/Progress";
import Settings from "./pages/candidate/Settings";

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import Candidates from "./pages/recruiter/Candidates";
import JobRoles from "./pages/recruiter/JobRoles";
import RecruiterEvents from "./pages/recruiter/Events";
import RecruiterSettings from "./pages/recruiter/Settings";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, userRole, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={userRole === 'candidate' ? '/dashboard' : '/recruiter'} replace />
          ) : (
            <Landing />
          )
        }
      />
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to={userRole === 'candidate' ? '/dashboard' : '/recruiter'} replace />
          ) : (
            <Auth />
          )
        }
      />

      {/* Candidate Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/events" element={<Events />} />
        <Route path="/settings" element={<Settings />} />

        {/* Recruiter Routes */}
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<JobRoles />} />
        <Route path="/recruiter/events" element={<RecruiterEvents />} />
        <Route path="/recruiter/candidates" element={<Candidates />} />
        <Route path="/recruiter/settings" element={<Settings />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </SidebarProvider>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
