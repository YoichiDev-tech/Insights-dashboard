import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EventRow {
  device: string | null;
  referrer: string | null;
  is_returning: boolean | null;
  is_lead: boolean | null;
  is_conversion: boolean | null;
}

const SegmentsPage: React.FC = () => {
  const [segments, setSegments] = useState({
    devices: {},
    referrers: {},
    returning: 0,
    leads: 0,
    conversions: 0
  });

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('device, referrer, is_returning, is_lead, is_conversion');

      if (error) return console.error(error);

      const rows = data as EventRow[];

      const deviceCounts: Record<string, number> = {};
      const refCounts: Record<string, number> = {};
      let returning = 0;
      let leads = 0;
      let conversions = 0;

      rows.forEach((e) => {
        if (e.device) deviceCounts[e.device] = (deviceCounts[e.device] || 0) + 1;
        if (e.referrer) refCounts[e.referrer] = (refCounts[e.referrer] || 0) + 1;
        if (e.is_returning) returning++;
        if (e.is_lead) leads++;
        if (e.is_conversion) conversions++;
      });

      setSegments({
        devices: deviceCounts,
        referrers: refCounts,
        returning,
        leads,
        conversions
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-black dark:text-white">Segments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Returning Users</p>
          <p className="text-2xl font-bold text-black dark:text-white">{segments.returning}</p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Leads</p>
          <p className="text-2xl font-bold text-black dark:text-white">{segments.leads}</p>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Conversions</p>
          <p className="text-2xl font-bold text-black dark:text-white">{segments.conversions}</p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Devices</p>
        {Object.entries(segments.devices).map(([dev, count]) => (
          <p key={dev} className="text-black dark:text-white">
            {dev}: {count}
          </p>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Referrers</p>
        {Object.entries(segments.referrers).map(([ref, count]) => (
          <p key={ref} className="text-black dark:text-white">
            {ref}: {count}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SegmentsPage;
