import Empty from './Empty';

interface Props {
  rows: Array<[string, number]>;
  emptyMessage: string;
  format?: (label: string) => string;
}

export default function RankedList({ rows, emptyMessage, format }: Props) {
  if (!rows.length) return <Empty>{emptyMessage}</Empty>;
  const max = Math.max(...rows.map(([, count]) => count));
  return (
    <ul className="space-y-3">
      {rows.map(([label, count]) => (
        <li key={label}>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="truncate text-slate-700 dark:text-slate-200" title={label}>
              {format ? format(label) : label}
            </span>
            <span className="font-semibold text-black dark:text-white">{count}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-sky-100 dark:bg-slate-800">
            <div className="h-1.5 rounded-full bg-sky-400 dark:bg-amber" style={{ width: `${Math.max(4, (count / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
