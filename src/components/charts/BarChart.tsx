import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDatum } from './types';
import { useChartTheme } from './useChartTheme';

interface Props {
  data: ChartDatum[];
  color?: string;
}

export default function BarChart({ data, color = '#ffb84d' }: Props) {
  const chart = useChartTheme();
  return (
    <div className="h-64 w-full min-w-0 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data}>
          <XAxis dataKey="name" stroke={chart.axis} tick={{ fontSize: 11 }} tickMargin={8} interval="preserveStartEnd" />
          <YAxis stroke={chart.axis} width={32} tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip {...chart.tooltip} />
          <Bar dataKey="value" fill={color} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}