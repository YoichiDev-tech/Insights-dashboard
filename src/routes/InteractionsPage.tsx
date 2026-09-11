import React from 'react';
import MetricCard from '../components/analytics/MetricCard';
import Panel from '../components/analytics/Panel';
import { countBy, eventLabel, formatPath } from '../lib/analytics';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';

const ignoredTypes = new Set(['pageview', 'session_start', 'session_end', 'scroll']);

const InteractionsPage: React.FC = () => {
  const { events, loading, error } = useAnalyticsEvents();
  const interactions = events.filter((event) => !ignoredTypes.has(event.type));
  const typeCounts = countBy(interactions.map((event) => event.type));
  const conversionTypes = new Set(['contact_submitted', 'audit_completed', 'audit_lead_captured', 'audit_teardown_requested', 'booking_completed', 'revamp_preview_generated', 'analysis_complete', 'audit_run']);
  const conversions = interactions.filter((event) => conversionTypes.has(event.type));
  const chatMessages = events.filter((event) => event.type === 'chat_message' || event.chat_length !== null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-white">Interactions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Actions, conversations, analyses, and conversion signals captured by the tracker.</p>
      </div>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Interactions" value={loading ? '...' : interactions.length} detail="Non-navigation events" />
        <MetricCard label="Conversions" value={loading ? '...' : conversions.length} detail="Configured conversion event types" />
        <MetricCard label="Chat messages" value={loading ? '...' : chatMessages.length} detail="Recorded chat activity" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Interaction mix" description="Counts are based on the event type stored by the tracker.">
          {Object.keys(typeCounts).length ? <div className="space-y-3">{Object.entries(typeCounts).sort(([, left], [, right]) => right - left).map(([type, count]) => <div key={type} className="flex items-center justify-between gap-4"><span className="truncate text-sm text-slate-700 dark:text-slate-200">{eventLabel(type)}</span><span className="text-sm font-semibold text-black dark:text-white">{count}</span></div>)}</div> : <p className="text-sm text-slate-500 dark:text-slate-400">No interactions recorded yet.</p>}
        </Panel>
        <Panel title="Top interaction pages" description="Pages where non-navigation events were recorded.">
          {interactions.length ? <div className="space-y-3">{Object.entries(countBy(interactions.map((event) => event.path))).sort(([, left], [, right]) => right - left).slice(0, 8).map(([path, count]) => <div key={path} className="flex items-center justify-between gap-4"><span className="truncate text-sm text-slate-700 dark:text-slate-200" title={path}>{formatPath(path)}</span><span className="text-sm font-semibold text-black dark:text-white">{count}</span></div>)}</div> : <p className="text-sm text-slate-500 dark:text-slate-400">No interaction pages available yet.</p>}
        </Panel>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Click-level reporting requires the source tracker to send distinct click event types. This view reports only events currently stored in the database.</p>
    </div>
  );
};

export default InteractionsPage;
