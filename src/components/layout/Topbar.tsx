import React from 'react';
import { useTheme } from '../../context/ThemeProvider';

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <header className="border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-pw_panel px-6 pt-4 pb-5 flex items-center justify-between transition-colors duration-300">
      {/* LEFT SIDE — TITLE + SUBTITLE */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
          PrismWave Studio
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Lead Generation & System Health
        </p>
      </div>

      {/* RIGHT SIDE — THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-200 text-black dark:bg-slate-700 dark:text-white text-xs font-medium transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-slate-600"
      >
        {dark ? (
          <>
            <span>Light mode</span>
            <span>☀️</span>
          </>
        ) : (
          <>
            <span>Dark mode</span>
            <span>🌙</span>
          </>
        )}
      </button>
    </header>
  );
};

export default TopBar;
