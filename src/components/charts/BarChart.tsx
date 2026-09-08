import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  data: any[];
  color?: string;
}

const BarChart: React.FC<Props> = ({ data, color = "#10b981" }) => {
  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="value" fill={color} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
