import React from 'react';
import AreaChart from '../components/charts/AreaChart';
import PieChart from '../components/charts/PieChart';
import EventTable from '../components/analytics/EventTable';
import MetricCard from '../components/analytics/MetricCard';
import Panel from '../components/analytics/Panel';
import { countBy, formatDuration } from '../lib/analytics';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';

const OverviewPage: React.FC = () => {
  const { events, loading, error } = useAnalyticsEvents();
  const pageviews = events.filter((event) => event.type === 'pageview');
  const sessions = events.filter((event) => event.type === 'session_end');
  const durations = sessions.flatMap((event) => event.duration_ms ?? []);
  const avgDuration = durations.length
    ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
    : 0;
  const devices = countBy(pageviews.map((event) => event.device || 'Unknown'));
  const daily = countBy(
    pageviews.map((event) => new Date(event.created_at).toISOString().slice(0, 10))
  );
  const trend = Object.entries(daily)
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-14)
    .map(([name, value]) => ({ name: name.slice(5), value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Lead Generation Overview</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">How campaigns are driving PrismWave Studio traffic and interactions.</p>
        <div className="mt-3 h-px w-full bg-sky-100 dark:bg-slate-700" />
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pageviews" value={loading ? '...' : pageviews.length} detail="Recorded visits" />
        <MetricCard label="Sessions" value={loading ? '...' : sessions.length} detail="Completed sessions" />
        <MetricCard label="Avg. session" value={loading ? '...' : formatDuration(avgDuration)} detail="Based on session ends" />
        <MetricCard label="Tracked actions" value={loading ? '...' : events.filter((event) => !['pageview', 'session_start', 'session_end', 'scroll'].includes(event.type)).length} detail="Chat and conversion signals" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <Panel title="Pageview trend" description="Most recent 14 calendar days in the loaded event window.">
          {trend.length ? <AreaChart data={trend} color="#38bdf8" /> : <p className="text-sm text-slate-500 dark:text-slate-400">No pageviews available for a trend yet.</p>}
        </Panel>
        <Panel title="Device mix" description="Devices recorded with pageviews.">
          {Object.keys(devices).length ? <PieChart data={Object.entries(devices).map(([name, value]) => ({ name, value }))} colors={["#38bdf8", "#22c55e", "#f59e0b", "#a855f7"]} /> : <p className="text-sm text-slate-500 dark:text-slate-400">No device data available yet.</p>}
        </Panel>
      </div>

      <Panel title="Latest activity" description="The newest events received by the analytics pipeline.">
        <EventTable events={events.slice(0, 8)} />
      </Panel>
    </div>
  );
};

export default OverviewPage;
