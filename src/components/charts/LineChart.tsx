import React from 'react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  data: any[];
  color?: string;
}

const LineChart: React.FC<Props> = ({ data, color = "#f59e0b" }) => {
  return (
    <div className="w-full min-w-0 h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} tickMargin={8} />
          <YAxis stroke="#94a3b8" width={32} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
