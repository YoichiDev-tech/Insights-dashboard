import type { TrackedEvent } from '../../lib/events';
import { eventLabel, timeAgo } from '../../lib/metrics';
import Empty from './Empty';

interface Props {
  events: TrackedEvent[];
  now: number;
  emptyMessage?: string;
}

export default function EventTable({ events, now, emptyMessage = 'No events recorded yet.' }: Props) {
  if (events.length === 0) return <Empty>{emptyMessage}</Empty>;

  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-4 py-2 font-medium sm:px-0">Event</th>
            <th className="px-4 py-2 font-medium">Page</th>
            <th className="px-4 py-2 font-medium">Source</th>
            <th className="px-4 py-2 font-medium">Device</th>
            <th className="px-4 py-2 font-medium">When</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {events.map((event) => (
            <tr key={event.id} className="text-slate-700 dark:text-slate-200">
              <td className="whitespace-nowrap px-4 py-3 font-medium sm:px-0">{eventLabel(event.name)}</td>
              <td className="max-w-[12rem] truncate px-4 py-3" title={event.path}>{event.path}</td>
              <td className="max-w-[10rem] truncate px-4 py-3 text-xs" title={event.referrer || event.source}>{event.source}</td>
              <td className="whitespace-nowrap px-4 py-3 capitalize">{event.device}</td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400" title={new Date(event.ts).toLocaleString()}>
                {timeAgo(event.ts, now)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
