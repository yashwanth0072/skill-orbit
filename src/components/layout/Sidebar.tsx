import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const candidateNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Assessments', path: '/assessments' },
  { icon: Briefcase, label: 'Opportunities', path: '/opportunities' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const recruiterNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/recruiter' },
  { icon: FileText, label: 'Job Roles', path: '/recruiter/jobs' },
  { icon: Users, label: 'Candidates', path: '/recruiter/candidates' },
  { icon: Settings, label: 'Settings', path: '/recruiter/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { userRole, setIsAuthenticated, setUserRole } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = userRole === 'candidate' ? candidateNavItems : recruiterNavItems;

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('candidate');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Orbit className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display font-bold text-xl text-foreground"
            >
              Skill Orbith
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
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
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
