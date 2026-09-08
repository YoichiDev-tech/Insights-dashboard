import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EventRow {
  user_id: string;
  created_at: string;
}

const RetentionPage: React.FC = () => {
  const [retention, setRetention] = useState({
    day1: 0,
    day7: 0,
    day30: 0
  });

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('user_id, created_at');

      if (error) return console.error(error);

      const rows = data as EventRow[];

      const firstSeen: Record<string, number> = {};
      const returnedDay1 = new Set<string>();
      const returnedDay7 = new Set<string>();
      const returnedDay30 = new Set<string>();

      rows.forEach((e) => {
        const t = new Date(e.created_at).getTime();
        if (!firstSeen[e.user_id]) firstSeen[e.user_id] = t;

        const diff = t - firstSeen[e.user_id];

        if (diff > 24 * 3600 * 1000 && diff < 48 * 3600 * 1000)
          returnedDay1.add(e.user_id);

        if (diff > 7 * 24 * 3600 * 1000 && diff < 8 * 24 * 3600 * 1000)
          returnedDay7.add(e.user_id);

        if (diff > 30 * 24 * 3600 * 1000 && diff < 31 * 24 * 3600 * 1000)
          returnedDay30.add(e.user_id);
      });

      setRetention({
        day1: returnedDay1.size,
        day7: returnedDay7.size,
        day30: returnedDay30.size
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Retention</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(retention).map(([period, count]) => (
          <div key={period} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">{period}</p>
            <p className="text-2xl font-bold text-black dark:text-white">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetentionPage;
