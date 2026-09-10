import React, { useEffect } from 'react';
import EventTable from '../components/analytics/EventTable';
import Panel from '../components/analytics/Panel';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';

const LiveFeedPage: React.FC = () => {
  const { events, loading, error, refresh } = useAnalyticsEvents(100);

  useEffect(() => {
    const interval = window.setInterval(() => void refresh(), 15000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-xl font-semibold text-black dark:text-white">Live Feed</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Recent events, refreshed automatically every 15 seconds.</p></div>
        <button type="button" onClick={() => void refresh()} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Refresh now</button>
      </div>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <Panel title={loading ? 'Loading activity...' : `${events.length} recent events`}>
        <EventTable events={events} emptyMessage="No recent events have been recorded." />
      </Panel>
    </div>
  );
};

export default LiveFeedPage;
