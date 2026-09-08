import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EventRow {
  country: string | null;
  city: string | null;
}

const GeoPage: React.FC = () => {
  const [geo, setGeo] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('country, city');

      if (error) return console.error(error);

      const rows = data as EventRow[];
      const counts: Record<string, number> = {};

      rows.forEach((e) => {
        const key = `${e.country || 'Unknown'} - ${e.city || 'Unknown'}`;
        counts[key] = (counts[key] || 0) + 1;
      });

      setGeo(counts);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Geographic Analytics</h1>

      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
        {Object.entries(geo).map(([loc, count]) => (
          <p key={loc} className="text-black dark:text-white">
            {loc}: {count}
          </p>
        ))}
      </div>
    </div>
  );
};

export default GeoPage;
