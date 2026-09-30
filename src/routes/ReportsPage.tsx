import { useMemo } from 'react';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import RankedList from '../components/analytics/RankedList';
import { RANGES } from '../context/eventsContext';
import { useEvents } from '../hooks/useEvents';
import { CONVERSION_EVENTS } from '../lib/events';
import {
  average,
  countBy,
  csvCell,
  eventLabel,
  formatDuration,
  humanOnly,
  measurableDurations,
  summarizeSessions,
  topEntries,
} from '../lib/metrics';
import type { TrackedEvent } from '../lib/events';

function downloadCsv(events: TrackedEvent[], rangeLabel: string) {
  if (!events.length) return;
  const headers = ['timestamp', 'kind', 'event', 'path', 'intent', 'session_id', 'source', 'medium', 'campaign', 'referrer', 'device'];
  const lines = events.map((event) =>
    [
      new Date(event.ts).toISOString(),
      event.kind,
      event.name,
      event.path,
      event.intent,
      event.sessionId,
      event.source,
      event.medium,
      event.campaign,
      event.referrer,
      event.device,
    ]
      .map(csvCell)
      .join(','),
  );
  const csv = [headers.join(','), ...lines].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `prismwave-events-${rangeLabel}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { events, loading, range } = useEvents();

  const view = useMemo(() => {
    const human = humanOnly(events);
    const sessions = summarizeSessions(human);
    return {
      human,
      pageviews: human.filter((event) => event.kind === 'pageview').length,
      sessions: sessions.length,
      conversions: human.filter((event) => CONVERSION_EVENTS.has(event.name)).length,
      avgDuration: average(measurableDurations(sessions)),
      sources: topEntries(countBy(sessions, (session) => session.source), 5),
      names: topEntries(countBy(human, (event) => event.name), 5),
    };
  }, [events]);

  const show = (value: string | number) => (loading ? '...' : value);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="A summary of the selected period, with a CSV export of the underlying events."
        actions={
          <button
            type="button"
            onClick={() => downloadCsv(view.human, range)}
            disabled={!view.human.length}
            className="min-h-11 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pageviews" value={show(view.pageviews)} />
        <MetricCard label="Sessions" value={show(view.sessions)} />
        <MetricCard label="Conversions" value={show(view.conversions)} detail="Contact, lead, teardown, booking" />
        <MetricCard label="Avg. session" value={show(formatDuration(view.avgDuration))} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Top sources">
          <RankedList rows={view.sources} emptyMessage="No source data in this period." />
        </Panel>
        <Panel title="Top event types">
          <RankedList rows={view.names} format={eventLabel} emptyMessage="No event data in this period." />
        </Panel>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Scope: {RANGES[range].label.toLowerCase()}, {view.human.length} human events (bots excluded). Revenue is not tracked by the platform.
      </p>
    </div>
  );
}
