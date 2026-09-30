import { useMemo } from 'react';
import Empty from '../components/analytics/Empty';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import { useEvents } from '../hooks/useEvents';
import { countBy, humanOnly, pct } from '../lib/metrics';

interface PageRow {
  path: string;
  views: number;
  sessions: number;
  entries: number;
  exits: number;
  actions: number;
}

export default function PagesPage() {
  const { events, loading } = useEvents();

  const rows = useMemo<PageRow[]>(() => {
    const human = humanOnly(events);
    const pageviews = human.filter((event) => event.kind === 'pageview').sort((a, b) => a.ts - b.ts);
    const views = countBy(pageviews, (event) => event.path);
    const actions = countBy(human.filter((event) => event.kind === 'action'), (event) => event.path);
    const sessionsByPath = new Map<string, Set<string>>();
    const firstPath = new Map<string, string>();
    const lastPath = new Map<string, string>();
    for (const event of pageviews) {
      const set = sessionsByPath.get(event.path) ?? new Set<string>();
      set.add(event.sessionId);
      sessionsByPath.set(event.path, set);
      if (!firstPath.has(event.sessionId)) firstPath.set(event.sessionId, event.path);
      lastPath.set(event.sessionId, event.path);
    }
    const entries = countBy([...firstPath.values()], (path) => path);
    const exits = countBy([...lastPath.values()], (path) => path);
    return [...views.entries()]
      .map(([path, count]) => ({
        path,
        views: count,
        sessions: sessionsByPath.get(path)?.size ?? 0,
        entries: entries.get(path) ?? 0,
        exits: exits.get(path) ?? 0,
        actions: actions.get(path) ?? 0,
      }))
      .sort((a, b) => b.views - a.views);
  }, [events]);

  const totalViews = rows.reduce((sum, row) => sum + row.views, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description="Which pages attract visits, start sessions, and end them." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard label="Tracked pages" value={loading ? '...' : rows.length} detail="Unique paths with pageviews" />
        <MetricCard label="Total pageviews" value={loading ? '...' : totalViews} />
      </div>

      <Panel title="Page performance" description="Entries and exits count the first and last page of each session.">
        {rows.length ? (
          <div className="-mx-4 overflow-x-auto sm:mx-0">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-medium sm:px-0">Page</th>
                  <th className="px-4 py-2 font-medium">Views</th>
                  <th className="px-4 py-2 font-medium">Sessions</th>
                  <th className="px-4 py-2 font-medium">Entries</th>
                  <th className="px-4 py-2 font-medium">Exit rate</th>
                  <th className="px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row) => (
                  <tr key={row.path} className="text-slate-700 dark:text-slate-200">
                    <td className="max-w-[16rem] truncate px-4 py-3 font-medium sm:px-0" title={row.path}>{row.path}</td>
                    <td className="px-4 py-3">{row.views}</td>
                    <td className="px-4 py-3">{row.sessions}</td>
                    <td className="px-4 py-3">{row.entries}</td>
                    <td className="px-4 py-3">{pct(row.exits, row.sessions)}%</td>
                    <td className="px-4 py-3">{row.actions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No pageviews recorded in this period.</Empty>
        )}
      </Panel>
    </div>
  );
}
