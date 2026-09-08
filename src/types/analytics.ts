export interface PageView {
  id: string;
  path: string;
  created_at: string;
  referrer: string | null;
  device: string | null;
}

export interface EventSummary {
  totalVisits: number;
  uniquePaths: number;
  avgPerDay: number;
}

export interface EngagementMetrics {
  bounceRate: number;
  avgSessionDurationSeconds: number;
  avgScrollDepthPercent: number;
}

export interface SourceBreakdown {
  label: string;
  value: number;
}
