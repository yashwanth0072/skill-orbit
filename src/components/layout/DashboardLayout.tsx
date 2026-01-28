import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';
import { useSidebarCollapsed } from '@/contexts/SidebarContext';

export function DashboardLayout() {
  const { collapsed } = useSidebarCollapsed();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`min-h-screen transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
