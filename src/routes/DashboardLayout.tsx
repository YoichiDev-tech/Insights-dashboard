import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/Topbar';
import { track } from '../lib/track';
import { startSession, endSession, recordScroll } from '../lib/session';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // pageviews
  useEffect(() => {
    track('pageview', path, {
      device: getDevice(),
      referrer: document.referrer || 'direct'
    });
  }, [path]);

  // sessions
  useEffect(() => {
    startSession(path);
    return () => {
      endSession(path);
    };
  }, [path]);

  // scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollDepth =
        (window.scrollY /
          (document.body.scrollHeight - window.innerHeight)) *
        100;

      recordScroll(path, Math.round(scrollDepth));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [path]);

  // close the drawer automatically if the viewport grows past mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex md:flex-row">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="min-w-0 flex-1 overflow-y-auto bg-transparent p-4 transition-colors duration-300 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function getDevice(): string {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export default DashboardLayout;
