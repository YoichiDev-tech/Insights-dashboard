import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EventRow {
  user_id: string;
  stage: string | null;
}

const FunnelsPage: React.FC = () => {
  const [funnel, setFunnel] = useState({
    landing: 0,
    scroll: 0,
    chat: 0,
    analysis: 0,
    lead: 0,
    conversion: 0
  });

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('user_id, stage');

      if (error) return console.error(error);

      const rows = data as EventRow[];

      const stages = {
        landing: new Set<string>(),
        scroll: new Set<string>(),
        chat: new Set<string>(),
        analysis: new Set<string>(),
        lead: new Set<string>(),
        conversion: new Set<string>()
      };

      rows.forEach((e) => {
        if (!e.stage || !e.user_id) return;
        if (stages[e.stage]) stages[e.stage].add(e.user_id);
      });

      setFunnel({
        landing: stages.landing.size,
        scroll: stages.scroll.size,
        chat: stages.chat.size,
        analysis: stages.analysis.size,
        lead: stages.lead.size,
        conversion: stages.conversion.size
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Funnels</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {Object.entries(funnel).map(([stage, count]) => (
          <div key={stage} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">{stage}</p>
            <p className="text-2xl font-bold text-black dark:text-white">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelsPage;
