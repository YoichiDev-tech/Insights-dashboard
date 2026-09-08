import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EventRow {
  id: string;
  type: string;
  path: string;
  device: string | null;
  referrer: string | null;
  duration_ms: number | null;
  scroll_depth: number | null;
  chat_length: number | null;
  analysis_score: number | null;
  issues_count: number | null;
  created_at: string;
}

const SourcesPage: React.FC = () => {
  const [referrers, setReferrers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return console.error(error);

      const rows = data as EventRow[];

      const refCounts: { [key: string]: number } = {};
      rows.forEach((e) => {
        if (e.referrer) {
          refCounts[e.referrer] = (refCounts[e.referrer] || 0) + 1;
        }
      });

      setReferrers(refCounts);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Traffic Sources</h1>

      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
        {Object.entries(referrers).map(([ref, count]) => (
          <p key={ref} className="text-black dark:text-white">
            {ref}: {count}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SourcesPage;
