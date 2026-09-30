import type { ReactNode } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { RANGES, type RangeKey } from '../../context/eventsContext';

interface Props {
  title: string;
  description: string;
  /** Hide the time-range picker on pages that do not depend on it. */
  hideRange?: boolean;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, hideRange = false, actions }: Props) {
  const { range, setRange, loading, error, truncated, refresh } = useEvents();

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2"> 
          {!hideRange && (
              <div className="relative">
                <select
                  value={range}
                  onChange={(event) => setRange(event.target.value as RangeKey)}
                  aria-label="Time range"
                  className="min-h-11 cursor-pointer appearance-none rounded-md border border-sky-200 bg-white/70 py-2 pl-3 pr-10 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {(Object.keys(RANGES) as RangeKey[]).map((key) => (
                    <option key={key} value={key}>
                      {RANGES[key].label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            )}
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="min-h-11 rounded-md border border-sky-200 px-3 text-sm font-medium text-sky-800 transition hover:bg-sky-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          {actions}
        </div>
      </div>
      <div className="h-px w-full bg-sky-100 dark:bg-slate-700" />
      {error && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}
      {truncated && (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          Event volume exceeded the 20,000-row load cap, so the oldest events in this window are not included.
        </p>
      )}
    </div>
  );
}
