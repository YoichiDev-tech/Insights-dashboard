import React from 'react';

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const Panel: React.FC<Props> = ({ title, description, children }) => (
  <section className="min-w-0 rounded-xl border border-white/80 bg-white/60 p-4 shadow-[0_12px_32px_rgba(76,145,180,0.12)] backdrop-blur-md dark:border-slate-800 dark:bg-pw_panel/90 sm:p-5">
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-black dark:text-white">{title}</h2>
      {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
    {children}
  </section>
);

export default Panel;
