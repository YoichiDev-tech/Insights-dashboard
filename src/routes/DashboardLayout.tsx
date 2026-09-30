import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { EventsProvider } from '../context/EventsProvider';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500 dark:text-slate-400">Checking session...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <EventsProvider>
      <div className="flex min-h-screen md:flex-row">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
          <main className="min-w-0 flex-1 overflow-y-auto p-4 transition-colors duration-300 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </EventsProvider>
  );
}
