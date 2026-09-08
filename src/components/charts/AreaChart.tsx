import React from 'react';
import {
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface Props {
  data: { label: string; value: number }[];
  gradientId?: string;
}

const AreaChart: React.FC<Props> = ({ data, gradientId = 'pwGradient' }) => {
  const dark = document.documentElement.classList.contains('dark');
  const textColor = dark ? '#cbd5f5' : '#1e293b';
  const gridColor = dark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="bg-white dark:bg-pw_panel border border-slate-300 dark:border-slate-800 rounded-xl p-4 shadow-lg shadow-slate-900/40">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RAreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                <stop offset="95%" stopColor={dark ? '#0f172a' : '#ffffff'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: textColor, fontSize: 11 }} />
            <YAxis tick={{ fill: textColor, fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? '#020617' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: 8
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </RAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChart;
