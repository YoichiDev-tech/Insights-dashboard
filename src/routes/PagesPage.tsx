import React from 'react';
import MetricCard from '../components/analytics/MetricCard';
import Panel from '../components/analytics/Panel';
import { formatPath } from '../lib/analytics';
import { useAnalyticsEvents } from '../hooks/useAnalyticsEvents';

const PagesPage: React.FC = () => {
  const { events, loading, error } = useAnalyticsEvents();
  const pageviews = events.filter((event) => event.type === 'pageview');
  const rows = Object.entries(
    pageviews.reduce<Record<string, { views: number; scrolls: number[] }>>((result, event) => {
      const row = result[event.path] ?? { views: 0, scrolls: [] };
      row.views += 1;
      if (event.scroll_depth !== null) row.scrolls.push(event.scroll_depth);
      result[event.path] = row;
      return result;
    }, {})
  )
    .map(([path, value]) => ({
      path,
      views: value.views,
      avgScroll: value.scrolls.length
        ? Math.round(value.scrolls.reduce((sum, scroll) => sum + scroll, 0) / value.scrolls.length)
        : null
    }))
    .sort((left, right) => right.views - left.views);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-white">Pages</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Which pages attract attention and how far visitors scroll.</p>
      </div>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard label="Tracked pages" value={loading ? '...' : rows.length} detail="Unique paths with pageviews" />
        <MetricCard label="Total pageviews" value={loading ? '...' : pageviews.length} detail="Within the loaded event window" />
      </div>
      <Panel title="Page performance" description="Scroll depth is shown only where scroll events were recorded.">
        {rows.length ? (
          <div className="-mx-4 overflow-x-auto sm:mx-0">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr><th className="px-4 py-2 font-medium sm:px-0">Page</th><th className="px-4 py-2 font-medium">Views</th><th className="px-4 py-2 font-medium">Avg. scroll</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row) => <tr key={row.path} className="text-slate-700 dark:text-slate-200"><td className="max-w-[16rem] truncate px-4 py-3 font-medium sm:px-0" title={row.path}>{formatPath(row.path)}</td><td className="px-4 py-3">{row.views}</td><td className="px-4 py-3">{row.avgScroll === null ? 'No data' : `${row.avgScroll}%`}</td></tr>)}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-slate-500 dark:text-slate-400">No pageviews recorded yet.</p>}
      </Panel>
    </div>
  );
};

export default PagesPage;
