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

const TrafficPage: React.FC = () => {
  const [pageviews, setPageviews] = useState(0);
  const [devices, setDevices] = useState<{ [key: string]: number }>({});
  const [referrers, setReferrers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return console.error(error);

      const rows = data as EventRow[];

      // pageviews
      const pv = rows.filter((e) => e.type === 'pageview').length;
      setPageviews(pv);

      // device breakdown
      const deviceCounts: { [key: string]: number } = {};
      rows.forEach((e) => {
        if (e.device) {
          deviceCounts[e.device] = (deviceCounts[e.device] || 0) + 1;
        }
      });
      setDevices(deviceCounts);

      // referrer breakdown
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
      <h1 className="text-xl font-semibold text-black dark:text-white">Traffic</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Pageviews</p>
          <p className="text-2xl font-bold text-black dark:text-white">{pageviews}</p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Devices</p>
          {Object.entries(devices).map(([device, count]) => (
            <p key={device} className="text-black dark:text-white">
              {device}: {count}
            </p>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Referrers</p>
          {Object.entries(referrers).map(([ref, count]) => (
            <p key={ref} className="text-black dark:text-white">
              {ref}: {count}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficPage;
