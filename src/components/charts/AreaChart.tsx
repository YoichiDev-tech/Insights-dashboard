import { AreaChart as ReAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDatum } from './types';
import { useChartTheme } from './useChartTheme';

interface Props {
  data: ChartDatum[];
  color?: string;
}

export default function AreaChart({ data, color = '#ffb84d' }: Props) {
  const chart = useChartTheme();
  return (
    <div className="h-64 w-full min-w-0 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data}>
          <XAxis dataKey="name" stroke={chart.axis} tick={{ fontSize: 11 }} tickMargin={8} minTickGap={16} />
          <YAxis stroke={chart.axis} width={32} tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip {...chart.tooltip} />
          <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}