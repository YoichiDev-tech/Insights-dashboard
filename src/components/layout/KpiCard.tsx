import React from 'react';

interface Props {
  label: string;
  value: string;
  delta?: string;
  tone?: 'neutral' | 'up' | 'down';
}

const toneMap = {
  neutral: 'text-gray-600 dark:text-pw_muted',
  up: 'text-pw_success',
  down: 'text-pw_danger'
};

const KpiCard: React.FC<Props> = ({ label, value, delta, tone = 'neutral' }) => {
  return (
    <div className="bg-white dark:bg-pw_panel border border-slate-300 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-lg shadow-slate-900/40">
      <p className="text-xs text-gray-600 dark:text-pw_muted uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="text-2xl font-semibold text-black dark:text-slate-50">
        {value}
      </p>
      {delta && (
        <p className={`text-xs ${toneMap[tone]}`}>
          {tone === 'up' ? '▲ ' : tone === 'down' ? '▼ ' : ''}
          {delta}
        </p>
      )}
    </div>
  );
};

export default KpiCard;
