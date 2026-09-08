import React from 'react';
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface Props {
  data: { label: string; value: number }[];
}

const COLORS = ['#38bdf8', '#a855f7', '#22c55e', '#f97316', '#ef4444'];

const PieChart: React.FC<Props> = ({ data }) => {
  const dark = document.documentElement.classList.contains('dark');
  const textColor = dark ? '#cbd5f5' : '#1e293b';

  return (
    <div className="bg-white dark:bg-pw_panel border border-slate-300 dark:border-slate-800 rounded-xl p-4 shadow-lg shadow-slate-900/40">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? '#020617' : '#ffffff',
                border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
                borderRadius: 8
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: textColor }} />
          </RPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
