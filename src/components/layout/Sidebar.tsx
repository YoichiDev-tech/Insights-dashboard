import { NavLink } from 'react-router-dom';

const ITEMS = [
  { label: 'Overview', to: '/overview' },
  { label: 'Traffic', to: '/traffic' },
  { label: 'Engagement', to: '/engagement' },
  { label: 'Sources', to: '/sources' },
  { label: 'Pages', to: '/pages' },
  { label: 'Interactions', to: '/interactions' },
  { label: 'Funnels', to: '/funnels' },
  { label: 'Leads', to: '/leads' },
  { label: 'Reports', to: '/reports' },
  { label: 'Live Feed', to: '/live-feed' },
  { label: 'System Health', to: '/system-health' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[80vw] transform flex-col border-r border-sky-100 bg-white/90 backdrop-blur-xl transition-transform duration-200 ease-out dark:border-slate-800 dark:bg-pw_panel md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-sky-100 px-4 py-4 dark:border-slate-800">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              PrismWave <span className="text-pw_accent">Ops Hub</span>
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">Private analytics &amp; system overview</p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-pw_muted dark:hover:bg-slate-900 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex min-h-11 w-full items-center rounded-md px-3 py-2 text-left text-sm transition ${
                  isActive
                    ? 'bg-sky-100 text-sky-900 dark:bg-ink-line dark:text-amber'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-900 dark:text-pw_muted dark:hover:bg-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
