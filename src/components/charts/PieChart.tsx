import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Props {
  data: any[];
  colors?: string[];
}

const PieChart: React.FC<Props> = ({ data, colors = ["#6366f1", "#10b981", "#f59e0b"] }) => {
  return (
    <div className="w-full min-w-0 h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius="62%"
            fill="#8884d8"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
