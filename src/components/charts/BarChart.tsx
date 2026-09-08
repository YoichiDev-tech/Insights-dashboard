import React from 'react';
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface Props {
  data: { label: string; value: number }[];
  color?: string;
}

const BarChart: React.FC<Props> = ({ data, color = '#38bdf8' }) => {
  const dark = document.documentElement.classList.contains('dark');
  const textColor = dark ? '#cbd5f5' : '#1e293b';
  const gridColor = dark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="bg-white dark:bg-pw_panel border border-slate-300 dark:border-slate-800 rounded-xl p-4 shadow-lg shadow-slate-900/40">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RBarChart data={data}>
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
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </RBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
