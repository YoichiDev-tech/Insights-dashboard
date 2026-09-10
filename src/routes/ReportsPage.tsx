import React, { useMemo } from 'react';
import MetricCard from '../components/analytics/MetricCard';
import Panel from '../components/analytics/Panel';
import { countBy, eventLabel, formatDuration } from '../lib/analytics';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';

function downloadCsv(rows: Record<string, string | number | null>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? '')).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `prismwave-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const ReportsPage: React.FC = () => {
  const { events, loading, error } = useAnalyticsEvents();
  const pageviews = events.filter((event) => event.type === 'pageview');
  const sessions = events.filter((event) => event.type === 'session_end');
  const conversionTypes = new Set(['contact_submitted', 'audit_completed', 'analysis_complete', 'audit_run']);
  const conversions = events.filter((event) => conversionTypes.has(event.type));
  const avgDuration = sessions.length ? Math.round(sessions.reduce((sum, event) => sum + (event.duration_ms ?? 0), 0) / sessions.length) : 0;
  const topSources = Object.entries(countBy(pageviews.map((event) => event.referrer || 'Direct'))).sort(([, left], [, right]) => right - left).slice(0, 5);
  const topEvents = Object.entries(countBy(events.map((event) => event.type))).sort(([, left], [, right]) => right - left).slice(0, 5);
  const exportRows = useMemo(() => events.map((event) => ({
    timestamp: event.created_at,
    event: eventLabel(event.type),
    path: event.path,
    device: event.device,
    referrer: event.referrer,
    duration_ms: event.duration_ms,
    scroll_depth: event.scroll_depth,
    chat_length: event.chat_length
  })), [events]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-xl font-semibold text-black dark:text-white">Reports</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A compact performance summary from the currently loaded event window.</p></div>
        <button type="button" onClick={() => downloadCsv(exportRows)} disabled={!exportRows.length} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200">Export CSV</button>
      </div>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pageviews" value={loading ? '...' : pageviews.length} />
        <MetricCard label="Sessions" value={loading ? '...' : sessions.length} />
        <MetricCard label="Conversions" value={loading ? '...' : conversions.length} detail="Known conversion event types" />
        <MetricCard label="Avg. session" value={loading ? '...' : formatDuration(avgDuration)} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Top sources"><div className="space-y-3">{topSources.length ? topSources.map(([source, count]) => <div key={source} className="flex justify-between gap-4 text-sm"><span className="truncate text-slate-700 dark:text-slate-200">{source}</span><strong className="text-black dark:text-white">{count}</strong></div>) : <p className="text-sm text-slate-500 dark:text-slate-400">No source data available yet.</p>}</div></Panel>
        <Panel title="Top event types"><div className="space-y-3">{topEvents.length ? topEvents.map(([type, count]) => <div key={type} className="flex justify-between gap-4 text-sm"><span className="text-slate-700 dark:text-slate-200">{eventLabel(type)}</span><strong className="text-black dark:text-white">{count}</strong></div>) : <p className="text-sm text-slate-500 dark:text-slate-400">No event data available yet.</p>}</div></Panel>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Report scope: the latest {events.length} events loaded from Supabase. This is not a financial or attribution report until campaign and revenue fields are instrumented.</p>
    </div>
  );
};

export default ReportsPage;
