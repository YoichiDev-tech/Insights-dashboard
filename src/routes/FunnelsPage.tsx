import React from 'react';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';

const FunnelsPage: React.FC = () => {
  const { events, loading, error } = useAnalyticsEvents();
  const stages = [
    ['Visitors', 'pageview'],
    ['Audits started', 'audit_run'],
    ['Audits completed', 'audit_completed'],
    ['Reports requested', 'audit_lead_captured'],
    ['Teardowns requested', 'audit_teardown_requested'],
    ['Revamp previews', 'revamp_preview_generated'],
    ['Contact submissions', 'contact_submitted'],
    ['Calls booked', 'booking_completed'],
  ] as const;
  const funnel = stages.map(([label, eventName]) => ({
    label,
    count: new Set(events.filter((event) => event.type === eventName).map((event) => event.session_id)).size,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Funnels</h1>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {funnel.map(({ label, count }) => (
          <div key={label} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-black dark:text-white">{loading ? '...' : count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelsPage;
