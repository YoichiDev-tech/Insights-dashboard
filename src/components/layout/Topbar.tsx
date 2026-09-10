import React from 'react';
import { useTheme } from '../../context/ThemeProvider';

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex w-full items-center justify-between gap-2 border-b border-sky-100/80 bg-white/45 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-pw_panel/80">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-sky-200 bg-white/70 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
        >
          <div className="space-y-1">
            <span className="block w-4 h-[2px] bg-slate-700 dark:bg-slate-200" />
            <span className="block w-4 h-[2px] bg-slate-700 dark:bg-slate-200" />
            <span className="block w-4 h-[2px] bg-slate-700 dark:bg-slate-200" />
          </div>
        </button>

        <div className="flex flex-col leading-tight min-w-0">
          <h1 className="text-base sm:text-xl font-semibold text-black dark:text-white truncate">
            PrismWave Studio
          </h1>
          <p className="hidden sm:block text-sm text-slate-600 dark:text-slate-300 mt-1 truncate">
            Lead Generation &amp; System Health
          </p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-sky-200 bg-white/70 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
