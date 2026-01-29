import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useSidebarCollapsed } from '@/contexts/SidebarContext';
import {
  LayoutDashboard,
  Target,
  Briefcase,
  Calendar,
  Settings,
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Orbit,
  TrendingUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const candidateNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Assessments', path: '/assessments' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: Briefcase, label: 'Opportunities', path: '/opportunities' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const recruiterNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/recruiter' },
  { icon: FileText, label: 'Job Roles', path: '/recruiter/jobs' },
  { icon: Calendar, label: 'Events', path: '/recruiter/events' },
  { icon: Users, label: 'Candidates', path: '/recruiter/candidates' },
  { icon: Settings, label: 'Settings', path: '/recruiter/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { userRole, setIsAuthenticated, setUserRole } = useApp();
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen, toggleMobile } = useSidebarCollapsed();

  const navItems = userRole === 'candidate' ? candidateNavItems : recruiterNavItems;

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('candidate');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          x: mobileOpen ? 0 : '-100%',
          opacity: 1
        }}
        // Reset transform on desktop so it's always visible
        style={{ x: undefined }}
        className={cn(
          'fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-50 transition-all duration-300',
          // Mobile: always fixed, width 64 (full/large), transform handled by mobileOpen
          // Desktop: sticky/fixed as before, transform always 0 via CSS override or media query logic
          'md:translate-x-0', // Always visible on desktop
          collapsed ? 'md:w-16 w-64' : 'w-64', // Mobile always full width (w-64), Desktop respects collapsed
          // Handle mobile slide via class if not using framer for everything
          !mobileOpen && 'max-md:-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="relative w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Orbit className="w-6 h-6 text-primary-foreground" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-display font-bold text-xl text-foreground">
                Skill Orbit
              </span>
            )}
          </Link>
          {/* Mobile Close Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobile}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              'w-full justify-start text-muted-foreground hover:text-foreground',
              (collapsed && !mobileOpen) && 'justify-center px-2'
            )}
          >
            <LogOut className="w-5 h-5" />
            {(!collapsed || mobileOpen) && <span className="ml-3">Logout</span>}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="w-full hidden md:flex"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
