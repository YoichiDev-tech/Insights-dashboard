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

const SystemHealthPage: React.FC = () => {
  const [avgScore, setAvgScore] = useState(0);
  const [avgIssues, setAvgIssues] = useState(0);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return console.error(error);

      const rows = data as EventRow[];

      const analysisEvents = rows.filter((e) => e.analysis_score !== null);

      const avgScoreCalc =
        analysisEvents.length > 0
          ? Math.round(
              analysisEvents.reduce(
                (sum, e) => sum + (e.analysis_score || 0),
                0
              ) / analysisEvents.length
            )
          : 0;

      const avgIssuesCalc =
        analysisEvents.length > 0
          ? Math.round(
              analysisEvents.reduce(
                (sum, e) => sum + (e.issues_count || 0),
                0
              ) / analysisEvents.length
            )
          : 0;

      setAvgScore(avgScoreCalc);
      setAvgIssues(avgIssuesCalc);
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title + Divider */}
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-white">
          System Health
        </h1>
        <div className="mt-2 h-px w-full bg-slate-300 dark:bg-slate-700" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Avg Analysis Score
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {avgScore}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Avg Issues Found
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {avgIssues}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
