import React from 'react';

interface Props {
  label: string;
  value: string | number;
  detail?: string;
}

const MetricCard: React.FC<Props> = ({ label, value, detail }) => (
  <section className="min-w-0 rounded-xl border border-white/80 bg-white/65 p-4 shadow-[0_10px_30px_rgba(76,145,180,0.12)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-800/80">
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-2 break-words text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
    {detail && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>}
  </section>
);

export default MetricCard;
