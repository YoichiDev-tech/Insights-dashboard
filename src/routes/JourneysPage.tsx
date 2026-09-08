import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EventRow {
  user_id: string;
  path: string;
  stage: string | null;
  created_at: string;
}

const JourneysPage: React.FC = () => {
  const [journeys, setJourneys] = useState<Record<string, EventRow[]>>({});

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('user_id, path, stage, created_at')
        .order('created_at', { ascending: true });

      if (error) return console.error(error);

      const rows = data as EventRow[];
      const grouped: Record<string, EventRow[]> = {};

      rows.forEach((e) => {
        if (!grouped[e.user_id]) grouped[e.user_id] = [];
        grouped[e.user_id].push(e);
      });

      setJourneys(grouped);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">User Journeys</h1>

      {Object.entries(journeys).map(([user, events]) => (
        <div key={user} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 mb-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">User: {user}</p>
          {events.map((e, i) => (
            <p key={i} className="text-black dark:text-white">
              {new Date(e.created_at).toLocaleTimeString()} → {e.path} ({e.stage})
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default JourneysPage;
