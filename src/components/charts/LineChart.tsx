import React from 'react';
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

interface Series {
  key: string;
  color: string;
  label: string;
}

interface Props {
  data: { label: string; [key: string]: number | string }[];
  series: Series[];
}

const LineChart: React.FC<Props> = ({ data, series }) => {
  const dark = document.documentElement.classList.contains('dark');
  const textColor = dark ? '#cbd5f5' : '#1e293b';
  const gridColor = dark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="bg-white dark:bg-pw_panel border border-slate-300 dark:border-slate-800 rounded-xl p-4 shadow-lg shadow-slate-900/40">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RLineChart data={data}>
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
            <Legend wrapperStyle={{ fontSize: 11, color: textColor }} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                name={s.label}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </RLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
