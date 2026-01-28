import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="ml-64 min-h-screen"
      >
        <div className="p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
