import { useMemo } from 'react';
import AreaChart from '../components/charts/AreaChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import Empty from '../components/analytics/Empty';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import { RANGES } from '../context/eventsContext';
import { useEvents } from '../hooks/useEvents';
import { countBy, delta, hourOfDaySeries, humanOnly, trendSeries } from '../lib/metrics';

export default function TrafficPage() {
  const { events, previousEvents, loading, range, now } = useEvents();

  const view = useMemo(() => {
    const pageviews = humanOnly(events).filter((event) => event.kind === 'pageview');
    const previous = humanOnly(previousEvents).filter((event) => event.kind === 'pageview');
    const visitors = new Set(pageviews.map((event) => event.visitorKey)).size;
    const devices = [...countBy(pageviews, (event) => event.device).entries()].map(([name, value]) => ({ name, value }));
    return {
      pageviews,
      visitors,
      change: delta(pageviews.length, previous.length),
      devices,
      trend: trendSeries(pageviews, RANGES[range].days, now),
      hours: hourOfDaySeries(pageviews),
    };
  }, [events, previousEvents, range, now]);

  return (
    <div className="space-y-6">
      <PageHeader title="Traffic" description="Volume and timing of human pageviews on the platform." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Pageviews" value={loading ? '...' : view.pageviews.length} detail={view.change.label} tone={view.change.tone} />
        <MetricCard label="Unique visitors" value={loading ? '...' : view.visitors} detail="Distinct hashed IPs" />
        <MetricCard
          label="Pages per visitor"
          value={loading ? '...' : view.visitors ? (view.pageviews.length / view.visitors).toFixed(1) : '0'}
        />
      </div>

      <Panel title="Pageviews over time" description={RANGES[range].label}>
        {view.pageviews.length ? <AreaChart data={view.trend} /> : <Empty>No pageviews recorded in this period.</Empty>}
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Busiest hours" description="Pageviews by hour of day, in your local time zone.">
          {view.pageviews.length ? <BarChart data={view.hours} color="#ffb84d" /> : <Empty>No pageviews recorded in this period.</Empty>}
        </Panel>
        <Panel title="Devices" description="Pageviews by device type.">
          {view.devices.length ? <PieChart data={view.devices} /> : <Empty>No device data in this period.</Empty>}
        </Panel>
      </div>
    </div>
  );
}
