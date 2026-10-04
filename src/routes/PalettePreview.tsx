import AreaChart from '../components/charts/AreaChart';
import PieChart from '../components/charts/PieChart';
import MetricCard from '../components/analytics/MetricCard';
import Panel from '../components/analytics/Panel';
import RankedList from '../components/analytics/RankedList';
import { useTheme } from '../hooks/useTheme';

const TREND = [
  { name: 'Mon', value: 184 },
  { name: 'Tue', value: 236 },
  { name: 'Wed', value: 208 },
  { name: 'Thu', value: 291 },
  { name: 'Fri', value: 254 },
  { name: 'Sat', value: 342 },
  { name: 'Sun', value: 318 },
];

const DEVICES = [
  { name: 'Desktop', value: 58 },
  { name: 'Mobile', value: 34 },
  { name: 'Tablet', value: 8 },
];

const PAGES: Array<[string, number]> = [
  ['/studio/services', 486],
  ['/studio/contact', 328],
  ['/studio/work', 241],
];

const ACTIVITY = [
  { event: 'page_view', page: '/studio/services', source: 'Google', device: 'Desktop', when: '1 min ago' },
  { event: 'form_submit', page: '/studio/contact', source: 'Direct', device: 'Mobile', when: '4 min ago' },
  { event: 'page_view', page: '/studio/work', source: 'Instagram', device: 'Mobile', when: '8 min ago' },
];

const NAV_ITEMS = ['Overview', 'Traffic', 'Engagement', 'Sources', 'Pages', 'Funnels', 'Leads', 'Reports'];

export default function PalettePreview() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-sky-100 bg-white/70 p-4 backdrop-blur-xl dark:border-slate-800 dark:bg-pw_panel/80 md:block">
        <div className="mb-8 border-b border-sky-100 pb-4 dark:border-slate-800">
          <p className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            PrismWave <span className="text-pw_accent">Ops Hub</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">Private analytics &amp; system overview</p>
        </div>
        <nav className="space-y-1" aria-label="Dashboard preview navigation">
          {NAV_ITEMS.map((item, index) => (
            <div
              key={item}
              className={`rounded-md px-3 py-2.5 text-sm ${
                index === 0
                  ? 'bg-sky-100 font-medium text-sky-900 dark:bg-ink-line dark:text-amber'
                  : 'text-slate-600 dark:text-pw_muted'
              }`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-sky-100/80 bg-white/45 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-pw_panel/80 sm:px-6">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">PrismWave Studio</p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Lead Generation &amp; System Health</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-sky-200 bg-white/70 px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] space-y-6 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-amber">Dashboard preview</p>
              <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Lead Generation Overview</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A sample view to preview the refreshed light and dark colour palettes.</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="min-h-10 rounded-md border border-sky-200 bg-white/70 px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Last 7 days
              </button>
              <button type="button" className="min-h-10 rounded-md border border-sky-200 px-3 text-sm font-medium text-sky-800 dark:border-slate-700 dark:text-slate-200">
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active now" value="18" detail="Sessions active in the last 5 min" tone="up" />
            <MetricCard label="Pageviews" value="1,842" detail="+12.8% vs previous period" tone="up" />
            <MetricCard label="Visitors" value="936" detail="+6.2% vs previous period" tone="up" />
            <MetricCard label="Conversions" value="74" detail="+3.1% vs previous period" tone="up" />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
            <Panel title="Pageview trend" description="Daily traffic over the last 7 days">
              <AreaChart data={TREND} />
            </Panel>
            <Panel title="Device mix" description="Sessions by device">
              <PieChart data={DEVICES} />
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Panel title="Top pages" description="Most visited pages in this period">
              <RankedList rows={PAGES} emptyMessage="No pages to show." />
            </Panel>
            <Panel title="Latest activity" description="Newest human events received by the tracker">
              <div className="-mx-4 overflow-x-auto sm:mx-0">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-2 font-medium sm:px-0">Event</th>
                      <th className="px-4 py-2 font-medium">Page</th>
                      <th className="px-4 py-2 font-medium">Source</th>
                      <th className="px-4 py-2 font-medium">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {ACTIVITY.map((row) => (
                      <tr key={`${row.event}-${row.page}`} className="text-slate-700 dark:text-slate-200">
                        <td className="whitespace-nowrap px-4 py-3 font-medium sm:px-0">{row.event}</td>
                        <td className="max-w-[10rem] truncate px-4 py-3">{row.page}</td>
                        <td className="px-4 py-3">{row.source}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{row.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">Preview data only · Dashboard authentication and live data are unchanged.</p>
        </main>
      </div>
    </div>
  );
}
