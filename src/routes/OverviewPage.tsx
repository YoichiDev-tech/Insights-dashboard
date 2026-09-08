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

const OverviewPage: React.FC = () => {
  const [pageviews, setPageviews] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [avgSessionDuration, setAvgSessionDuration] = useState(0);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const rows = data as EventRow[];

      const pv = rows.filter((e) => e.type === 'pageview').length;
      const ss = rows.filter((e) => e.type === 'session_end');
      const avg =
        ss.length > 0
          ? Math.round(
              ss.reduce((sum, e) => sum + (e.duration_ms || 0), 0) / ss.length
            )
          : 0;

      setPageviews(pv);
      setSessions(ss.length);
      setAvgSessionDuration(avg);
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-white">
          Overview
        </h1>

        {/* Divider */}
        <div className="mt-2 h-px w-full bg-slate-300 dark:bg-slate-700" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Pageviews</p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {pageviews}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Sessions</p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {sessions}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Avg session duration (ms)
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {avgSessionDuration}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
