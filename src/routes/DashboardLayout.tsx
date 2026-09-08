import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/Topbar';
import { track } from '../lib/track';
import { startSession, endSession, recordScroll } from '../lib/session';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

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

  return (
    <div className="flex h-screen bg-white dark:bg-pw_bg transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gradient-to-br dark:from-pw_bg dark:via-slate-900 dark:to-pw_bg transition-colors duration-300">
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
