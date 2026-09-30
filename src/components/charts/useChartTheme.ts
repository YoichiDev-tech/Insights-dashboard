import { useTheme } from '../../hooks/useTheme';

export const STUDIO_COLORS = ['#ffb84d', '#ff7a59', '#6c63ff', '#37e6c4', '#ff6fa8', '#8b93a7'];

export function useChartTheme() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return {
    axis: dark ? '#8b93a7' : '#94a3b8',
    tooltip: {
      contentStyle: {
        background: dark ? '#10182b' : '#ffffff',
        border: `1px solid ${dark ? '#1e2534' : '#e2e8f0'}`,
        borderRadius: 8,
        color: dark ? '#f3f4f1' : '#0f172a',
        fontSize: 12,
      },
      labelStyle: { color: dark ? '#8b93a7' : '#475569' },
      itemStyle: { color: dark ? '#f3f4f1' : '#0f172a' },
      cursor: { fill: dark ? 'rgba(255,184,77,0.08)' : 'rgba(56,189,248,0.08)' },
    },
  };
}