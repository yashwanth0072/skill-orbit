import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';
import { useSidebarCollapsed } from '@/contexts/SidebarContext';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Orbit } from 'lucide-react';

export function DashboardLayout() {
  const { collapsed, toggleMobile } = useSidebarCollapsed();

  return (
    <div className="min-h-screen bg-background relative">
      <Sidebar />

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Orbit className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">Skill Orbit</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMobile}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`min-h-screen transition-all duration-300 w-full ${collapsed ? 'md:ml-16' : 'md:ml-64'
          } ml-0`}
      >
        <div className="p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
