import { useMemo } from 'react';
import BarChart from '../components/charts/BarChart';
import Empty from '../components/analytics/Empty';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import { useEvents } from '../hooks/useEvents';
import {
  average,
  formatDuration,
  humanOnly,
  isBounce,
  measurableDurations,
  pct,
  summarizeSessions,
} from '../lib/metrics';

export default function EngagementPage() {
  const { events, loading } = useEvents();

  const view = useMemo(() => {
    const sessions = summarizeSessions(humanOnly(events));
    const withPageviews = sessions.filter((session) => session.pageviews > 0);
    const bounces = withPageviews.filter(isBounce).length;
    const depth = [1, 2, 3, 4, 5].map((pages) => ({
      name: pages === 5 ? '5+' : String(pages),
      value: withPageviews.filter((session) => (pages === 5 ? session.pageviews >= 5 : session.pageviews === pages)).length,
    }));
    const devices = ['desktop', 'mobile', 'tablet', 'unknown'].map((device) => {
      const group = withPageviews.filter((session) => session.device === device);
      return {
        device,
        sessions: group.length,
        bounce: pct(group.filter(isBounce).length, group.length),
        duration: average(measurableDurations(group)),
      };
    }).filter((row) => row.sessions > 0);
    return {
      sessions: withPageviews,
      bounceRate: pct(bounces, withPageviews.length),
      avgDuration: average(measurableDurations(withPageviews)),
      pagesPerSession: average(withPageviews.map((session) => session.pageviews)),
      interacted: withPageviews.filter((session) => session.actions > 0).length,
      depth,
      devices,
    };
  }, [events]);

  const show = (value: string | number) => (loading ? '...' : value);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engagement"
        description="How visitors behave once they arrive. Scroll depth is not collected by the platform tracker, so it is not shown."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Bounce rate" value={show(`${view.bounceRate}%`)} detail="Single-page sessions with no action" />
        <MetricCard label="Avg. session" value={show(formatDuration(view.avgDuration))} detail="Sessions with 2+ events" />
        <MetricCard label="Pages / session" value={show(view.pagesPerSession.toFixed(1))} />
        <MetricCard label="Sessions with an action" value={show(view.interacted)} detail={`${pct(view.interacted, view.sessions.length)}% of sessions`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Session depth" description="Sessions by number of pages viewed.">
          {view.sessions.length ? <BarChart data={view.depth} color="#6c63ff" /> : <Empty>No sessions recorded in this period.</Empty>}
        </Panel>
        <Panel title="By device">
          {view.devices.length ? (
            <div className="-mx-4 overflow-x-auto sm:mx-0">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-medium sm:px-0">Device</th>
                    <th className="px-4 py-2 font-medium">Sessions</th>
                    <th className="px-4 py-2 font-medium">Bounce</th>
                    <th className="px-4 py-2 font-medium">Avg. session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {view.devices.map((row) => (
                    <tr key={row.device} className="text-slate-700 dark:text-slate-200">
                      <td className="px-4 py-3 font-medium capitalize sm:px-0">{row.device}</td>
                      <td className="px-4 py-3">{row.sessions}</td>
                      <td className="px-4 py-3">{row.bounce}%</td>
                      <td className="px-4 py-3">{formatDuration(row.duration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>No sessions recorded in this period.</Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}
