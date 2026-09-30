import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartDatum } from './types';
import { STUDIO_COLORS, useChartTheme } from './useChartTheme';

interface Props {
  data: ChartDatum[];
  colors?: string[];
}

export default function PieChart({ data, colors = STUDIO_COLORS }: Props) {
  const chart = useChartTheme();
  return (
    <div className="h-72 w-full min-w-0 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius="62%" stroke="none">
            {data.map((datum, index) => (
              <Cell key={datum.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip {...chart.tooltip} />
          <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 8, color: chart.axis }} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}