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
    const conversionEvents = current.filter((event) => CONVERSION_EVENTS.has(event.name));
    const previousConversions = previous.filter((event) => CONVERSION_EVENTS.has(event.name)).length;
    const conversionSessions = new Set(conversionEvents.map((event) => event.sessionId)).size;
    const active = new Set(current.filter((event) => now - event.ts <= ACTIVE_WINDOW_MS).map((event) => event.sessionId)).size;
    const devices = [...countBy(sessions, (session) => session.device).entries()].map(([name, value]) => ({ name, value }));
    const sourceSessions = sessions.filter((session) => session.pageviews > 0);
    const topSource = [...countBy(sourceSessions, (session) => session.source).entries()]
      .sort((a, b) => b[1] - a[1])[0];
    return {
      current,
      pageviews,
      sessions,
      visitors,
      conversions: conversionEvents.length,
      conversionSessions,
      conversionRate: sessions.length ? Math.round((conversionSessions / sessions.length) * 1000) / 10 : 0,
      topSource,
      active,
      avgDuration: average(measurableDurations(sessions)),
      devices,
      deltas: {
        pageviews: delta(pageviews.length, previousPageviews.length),
        visitors: delta(visitors, previousVisitors),
        sessions: delta(sessions.length, previousSessions.length),
        conversions: delta(conversionEvents.length, previousConversions),
      },
      trend: trendSeries(pageviews, RANGES[range].days, now),
    };
  }, [events, previousEvents, range, now]);

  const show = (value: string | number) => (loading ? '...' : value);
  const hasSessions = view.sessions.length > 0;
  const hasConversions = view.conversionSessions > 0;

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

      <Panel
        title="Business readout"
        description={`What the real data suggests for ${RANGES[range].label.toLowerCase()} — and what to do next.`}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current signal</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {loading ? 'Reading current signals…' : !hasSessions ? 'Reach is the first constraint' : !hasConversions ? 'Validate the conversion path' : 'A demand signal is present'}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {loading
                ? 'Loading the selected period…'
                : !hasSessions
                  ? 'There is not enough traffic in this period to judge the offer. A quiet day is a distribution signal, not a verdict on the business.'
                  : !hasConversions
                    ? `${view.sessions.length} sessions were recorded, but none included a tracked conversion. With a small sample, treat this as a question to investigate—not proof the offer is wrong.`
                    : `${view.conversionSessions} of ${view.sessions.length} sessions included a conversion event (${view.conversionRate}%). Follow the signal through to qualified leads and real outcomes.`}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">What the data says</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>• {loading ? 'Loading sessions…' : `${view.sessions.length} human sessions and ${view.pageviews.length} pageviews in this period.`}</li>
                <li>• {loading ? 'Checking conversions…' : `${view.conversionSessions} converting sessions (${view.conversionRate}% of sessions).`}</li>
                <li>• {loading ? 'Checking attribution…' : view.topSource ? `Most common recorded source: ${view.topSource[0]} (${view.topSource[1]} sessions).` : 'No source attribution is available yet.'}</li>
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Next best actions</h3>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {loading ? (
                  <li className="list-none">Recommendations will appear once the selected period has finished loading.</li>
                ) : !hasSessions ? (
                  <>
                    <li>Publish one useful, specific post for your target customer; use UTM tags so its visits are attributable.</li>
                    <li>Send five thoughtful, relevant outreach messages and record the replies—not just the number sent.</li>
                    <li>Check the main call to action, contact form, and audit flow end-to-end before driving more traffic.</li>
                  </>
                ) : !hasConversions ? (
                  <>
                    <li>Review the top landing pages and make the next step obvious: contact, request an audit, or book a call.</li>
                    <li>Run one small, tagged marketing experiment and compare it with an equally long previous period.</li>
                    <li>Test the conversion flow yourself; do not redesign the whole site based on a small sample.</li>
                  </>
                ) : (
                  <>
                    <li>Open Leads and follow up on new enquiries; update each lead's status and eventual outcome.</li>
                    <li>Inspect the source and landing page associated with converting sessions, then repeat what appears to work.</li>
                    <li>Keep tagging campaigns so future visits and leads can be tied to specific marketing efforts.</li>
                  </>
                )}
              </ol>
            </section>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This dashboard measures visitor behavior, not marketing effort. Log campaign activity separately, tag links with UTMs, and judge progress using qualified leads and outcomes—not traffic volume alone.
          </p>
        </div>
      </Panel>

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
