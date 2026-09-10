import React from 'react';
import {
  eventLabel,
  formatDate,
  formatPath,
  type AnalyticsEvent
} from '../../lib/analytics';

interface Props {
  events: AnalyticsEvent[];
  emptyMessage?: string;
}

const EventTable: React.FC<Props> = ({ events, emptyMessage = 'No events recorded yet.' }) => {
  if (events.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>;
  }

  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-4 py-2 font-medium sm:px-0">Event</th>
            <th className="px-4 py-2 font-medium">Page</th>
            <th className="px-4 py-2 font-medium">Device</th>
            <th className="px-4 py-2 font-medium">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {events.map((event) => (
            <tr key={event.id} className="text-slate-700 dark:text-slate-200">
              <td className="whitespace-nowrap px-4 py-3 font-medium sm:px-0">{eventLabel(event.type)}</td>
              <td className="max-w-[12rem] truncate px-4 py-3" title={event.path}>{formatPath(event.path)}</td>
              <td className="whitespace-nowrap px-4 py-3">{event.device || 'Unknown'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{formatDate(event.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
