import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function Panel({ title, description, children }: Props) {
  return (
    <section className="min-w-0 rounded-xl border border-white bg-white p-4 shadow-[0_10px_28px_rgba(77,106,170,0.13)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(77,106,170,0.21)] dark:border-[#2b3a55] dark:bg-[#17243a] dark:shadow-[0_10px_28px_rgba(0,0,0,0.26)] dark:hover:border-[#405576] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-black dark:text-white">{title}</h2>
        {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}
