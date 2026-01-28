import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";

// Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Candidate Pages
import CandidateDashboard from "./pages/candidate/Dashboard";
import Assessments from "./pages/candidate/Assessments";
import Opportunities from "./pages/candidate/Opportunities";
import Events from "./pages/candidate/Events";
import Settings from "./pages/candidate/Settings";

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import Candidates from "./pages/recruiter/Candidates";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, userRole } = useApp();

  return (
    <Routes>
      {/* Public Route */}
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
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/events" element={<Events />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Recruiter Routes */}
        <Route path="/recruiter" element={<RecruiterDashboard />} />
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
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
