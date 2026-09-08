import React from 'react';
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  data: any[];
  color?: string;
}

const AreaChart: React.FC<Props> = ({ data, color = "#6366f1" }) => {
  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
          />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
