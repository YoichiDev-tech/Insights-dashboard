interface Props {
  label: string;
  value: string | number;
  detail?: string;
  tone?: 'up' | 'down' | 'flat';
}

const TONES = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-red-600 dark:text-red-400',
  flat: 'text-slate-500 dark:text-slate-400',
};

export default function MetricCard({ label, value, detail, tone = 'flat' }: Props) {
  return (
    <section className="min-w-0 rounded-xl border border-white bg-white p-4 shadow-[0_8px_24px_rgba(77,106,170,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(77,106,170,0.2)] dark:border-[#2b3a55] dark:bg-[#17243a] dark:shadow-[0_8px_24px_rgba(0,0,0,0.24)] dark:hover:border-[#405576] dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.38)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 break-words text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      {detail && <p className={`mt-1 text-xs ${TONES[tone]}`}>{detail}</p>}
    </section>
  );
}
