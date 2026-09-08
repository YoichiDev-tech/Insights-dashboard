import React from 'react';

interface Props {
  active: string;
  onRouteChange: (r: any) => void;
}

const items = [
  { key: 'overview', label: 'Overview' },
  { key: 'traffic', label: 'Traffic' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'sources', label: 'Sources' },
  { key: 'system', label: 'System Health' }
];

const Sidebar: React.FC<Props> = ({ active, onRouteChange }) => {
  return (
    <aside className="w-64 bg-white dark:bg-pw_panel border-r border-slate-300 dark:border-slate-800 flex flex-col">
      <div className="px-4 py-4 border-b border-slate-300 dark:border-slate-800">
        <h1 className="text-lg font-semibold tracking-tight text-black dark:text-slate-100">
          PrismWave <span className="text-pw_accent">Ops Hub</span>
        </h1>
        <p className="text-xs text-gray-600 dark:text-pw_muted mt-1">
          Private analytics & system overview
        </p>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onRouteChange(item.key)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition
              ${
                active === item.key
                  ? 'bg-gray-200 dark:bg-slate-800 text-black dark:text-slate-50'
                  : 'text-gray-600 dark:text-pw_muted hover:bg-gray-100 dark:hover:bg-slate-900 hover:text-black dark:hover:text-slate-100'
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
