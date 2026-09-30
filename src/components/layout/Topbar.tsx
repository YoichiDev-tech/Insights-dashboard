import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  onToggleSidebar: () => void;
}

const REALTIME_STYLES = {
  live: { dot: 'bg-emerald-500', label: 'Live' },
  connecting: { dot: 'bg-amber-400', label: 'Connecting' },
  offline: { dot: 'bg-red-500', label: 'Realtime off' },
};

export default function Topbar({ onToggleSidebar }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { signOut, session } = useAuth();
  const { realtime } = useEvents();
  const status = REALTIME_STYLES[realtime];

  return (
    <header className="flex w-full items-center justify-between gap-2 border-b border-sky-100/80 bg-white/45 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-pw_panel/80">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-sky-200 bg-white/70 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:hidden"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
        >
          <div className="space-y-1">
            <span className="block h-[2px] w-4 bg-slate-700 dark:bg-slate-200" />
            <span className="block h-[2px] w-4 bg-slate-700 dark:bg-slate-200" />
            <span className="block h-[2px] w-4 bg-slate-700 dark:bg-slate-200" />
          </div>
        </button>

        <div className="flex min-w-0 flex-col leading-tight">
          <p className="truncate text-base font-semibold text-black dark:text-white sm:text-xl">PrismWave Studio</p>
          <p className="mt-1 hidden truncate text-sm text-slate-600 dark:text-slate-300 sm:block">
            Lead Generation &amp; System Health
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden items-center gap-2 text-xs text-slate-600 dark:text-slate-300 sm:inline-flex" title="Realtime event stream">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        <span className="hidden max-w-[10rem] truncate text-xs text-slate-500 dark:text-slate-400 lg:inline">
          {session?.user.email}
        </span>
        <button
          type="button"
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
        <button
          type="button"
          onClick={() => void signOut()}
          className="min-h-11 rounded-md border border-sky-200 bg-white/70 px-3 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
