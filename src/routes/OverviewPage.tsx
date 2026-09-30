import { useMemo } from 'react';
import AreaChart from '../components/charts/AreaChart';
import PieChart from '../components/charts/PieChart';
import EventTable from '../components/analytics/EventTable';
import Empty from '../components/analytics/Empty';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import { RANGES } from '../context/eventsContext';
import { useEvents } from '../hooks/useEvents';
import { CONVERSION_EVENTS } from '../lib/events';
import {
  average,
  countBy,
  delta,
  formatDuration,
  humanOnly,
  measurableDurations,
  summarizeSessions,
  trendSeries,
} from '../lib/metrics';

const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

export default function OverviewPage() {
  const { events, previousEvents, loading, range, now } = useEvents();

  const view = useMemo(() => {
    const current = humanOnly(events);
    const previous = humanOnly(previousEvents);
    const pageviews = current.filter((event) => event.kind === 'pageview');
    const previousPageviews = previous.filter((event) => event.kind === 'pageview');
    const sessions = summarizeSessions(current);
    const previousSessions = summarizeSessions(previous);
    const visitors = new Set(current.map((event) => event.visitorKey)).size;
    const previousVisitors = new Set(previous.map((event) => event.visitorKey)).size;
    const conversions = current.filter((event) => CONVERSION_EVENTS.has(event.name)).length;
    const previousConversions = previous.filter((event) => CONVERSION_EVENTS.has(event.name)).length;
    const active = new Set(current.filter((event) => now - event.ts <= ACTIVE_WINDOW_MS).map((event) => event.sessionId)).size;
    const devices = [...countBy(sessions, (session) => session.device).entries()].map(([name, value]) => ({ name, value }));
    return {
      current,
      pageviews,
      sessions,
      visitors,
      conversions,
      active,
      avgDuration: average(measurableDurations(sessions)),
      devices,
      deltas: {
        pageviews: delta(pageviews.length, previousPageviews.length),
        visitors: delta(visitors, previousVisitors),
        sessions: delta(sessions.length, previousSessions.length),
        conversions: delta(conversions, previousConversions),
      },
      trend: trendSeries(pageviews, RANGES[range].days, now),
    };
  }, [events, previousEvents, range, now]);

  const show = (value: string | number) => (loading ? '...' : value);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Generation Overview"
        description="Real traffic and conversions recorded by the PrismWave Studio platform. Bots are excluded."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Active now" value={show(view.active)} detail="Sessions active in the last 5 min" />
        <MetricCard label="Pageviews" value={show(view.pageviews.length)} detail={view.deltas.pageviews.label} tone={view.deltas.pageviews.tone} />
        <MetricCard label="Visitors" value={show(view.visitors)} detail={view.deltas.visitors.label} tone={view.deltas.visitors.tone} />
        <MetricCard label="Sessions" value={show(view.sessions.length)} detail={view.deltas.sessions.label} tone={view.deltas.sessions.tone} />
        <MetricCard label="Conversions" value={show(view.conversions)} detail={view.deltas.conversions.label} tone={view.deltas.conversions.tone} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <Panel
          title="Pageview trend"
          description={`${RANGES[range].label}. Avg. session length: ${formatDuration(view.avgDuration)} (sessions with 2+ events).`}
        >
          {view.pageviews.length ? <AreaChart data={view.trend} /> : <Empty>No pageviews recorded in this period.</Empty>}
        </Panel>
        <Panel title="Device mix" description="Sessions by device, derived from the browser user agent.">
          {view.devices.length ? <PieChart data={view.devices} /> : <Empty>No sessions recorded in this period.</Empty>}
        </Panel>
      </div>

      <Panel title="Latest activity" description="Newest human events received by the tracker.">
        <EventTable events={view.current.slice(0, 8)} now={now} />
      </Panel>
    </div>
  );
}
