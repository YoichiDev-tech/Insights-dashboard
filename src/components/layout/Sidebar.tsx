import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const items = [
  { key: 'overview', label: 'Overview', path: '/overview' },
  { key: 'traffic', label: 'Traffic', path: '/traffic' },
  { key: 'engagement', label: 'Engagement', path: '/engagement' },
  { key: 'sources', label: 'Sources', path: '/sources' },
  { key: 'pages', label: 'Pages', path: '/pages' },
  { key: 'interactions', label: 'Interactions', path: '/interactions' },
  { key: 'funnels', label: 'Funnels', path: '/funnels' },
  { key: 'leads', label: 'Leads', path: '/leads' },
  { key: 'reports', label: 'Reports', path: '/reports' },
  { key: 'live-feed', label: 'Live Feed', path: '/live-feed' },
  { key: 'system-health', label: 'System Health', path: '/system-health' }
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activePath =
    location.pathname === '/' ? '/overview' : location.pathname;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[80vw] transform flex-col border-r border-sky-100 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-pw_panel
          transition-transform duration-200 ease-out
          md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-sky-100 px-4 py-4 dark:border-slate-800">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              PrismWave <span className="text-pw_accent">Ops Hub</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">
              Private analytics &amp; system overview
            </p>
          </div>

          {/* Close button, mobile only */}
          <button
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-600 dark:text-pw_muted hover:bg-gray-100 dark:hover:bg-slate-900"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = activePath === item.path;

            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.path)}
                className={`w-full min-h-11 text-left px-3 py-2 rounded-md text-sm transition
                  ${
                    isActive
                      ? 'bg-sky-100 text-sky-900 dark:bg-slate-800 dark:text-slate-50'
                        : 'text-slate-600 dark:text-pw_muted hover:bg-sky-50 hover:text-sky-900 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
