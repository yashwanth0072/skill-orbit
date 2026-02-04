import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import React, { Suspense, lazy } from "react";

// Lazy load pages for better performance
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Candidate Pages
const CandidateDashboard = lazy(() => import("./pages/candidate/Dashboard"));
const Assessments = lazy(() => import("./pages/candidate/Assessments"));
const Opportunities = lazy(() => import("./pages/candidate/Opportunities"));
const Events = lazy(() => import("./pages/candidate/Events"));
const Progress = lazy(() => import("./pages/candidate/Progress"));
const Settings = lazy(() => import("./pages/candidate/Settings"));

// Recruiter Pages
const RecruiterDashboard = lazy(() => import("./pages/recruiter/Dashboard"));
const Candidates = lazy(() => import("./pages/recruiter/Candidates"));
const JobRoles = lazy(() => import("./pages/recruiter/JobRoles"));
const RecruiterEvents = lazy(() => import("./pages/recruiter/Events"));
const RecruiterSettings = lazy(() => import("./pages/recruiter/Settings"));

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

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
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/recruiter/settings" element={<RecruiterSettings />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppProvider>
            <SidebarProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </SidebarProvider>
          </AppProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
