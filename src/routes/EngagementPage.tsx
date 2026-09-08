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

const EngagementPage: React.FC = () => {
  const [avgScroll, setAvgScroll] = useState(0);
  const [avgSession, setAvgSession] = useState(0);
  const [chatMessages, setChatMessages] = useState(0);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return console.error(error);

      const rows = data as EventRow[];

      // SCROLL DEPTH
      const scrollEvents = rows.filter((e) => e.scroll_depth !== null);
      const avgScrollDepth =
        scrollEvents.length > 0
          ? Math.round(
              scrollEvents.reduce((sum, e) => sum + (e.scroll_depth || 0), 0) /
                scrollEvents.length
            )
          : 0;
      setAvgScroll(avgScrollDepth);

      // SESSION DURATION
      const sessionEnds = rows.filter((e) => e.type === 'session_end');
      const avgSessionDuration =
        sessionEnds.length > 0
          ? Math.round(
              sessionEnds.reduce(
                (sum, e) => sum + (e.duration_ms || 0),
                0
              ) / sessionEnds.length
            )
          : 0;
      setAvgSession(avgSessionDuration);

      // CHAT MESSAGES
      const chatEvents = rows.filter((e) => e.chat_length !== null);
      const totalChatLength = chatEvents.reduce(
        (sum, e) => sum + (e.chat_length || 0),
        0
      );
      setChatMessages(totalChatLength);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Engagement</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Avg Scroll Depth</p>
          <p className="text-2xl font-bold text-black dark:text-white">{avgScroll}%</p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Avg Session Duration</p>
          <p className="text-2xl font-bold text-black dark:text-white">{avgSession} ms</p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Chat Activity</p>
          <p className="text-2xl font-bold text-black dark:text-white">{chatMessages}</p>
        </div>
      </div>
    </div>
  );
};

export default EngagementPage;
