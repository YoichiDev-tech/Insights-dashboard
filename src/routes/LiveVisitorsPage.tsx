import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EventRow {
  user_id: string;
  created_at: string;
}

const LiveVisitorsPage: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('events')
        .select('user_id, created_at')
        .gte('created_at', since);

      if (error) return console.error(error);

      const rows = data as EventRow[];
      const unique = new Set(rows.map((e) => e.user_id));

      setCount(unique.size);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Live Visitors</h1>

      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Active now</p>
        <p className="text-3xl font-bold text-black dark:text-white">{count}</p>
      </div>
    </div>
  );
};

export default LiveVisitorsPage;
