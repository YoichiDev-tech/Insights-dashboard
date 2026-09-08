import { supabase } from './supabaseClient';
import type {
  EngagementMetrics,
  EventSummary,
  SourceBreakdown,
  PageView
} from '../types/analytics';

export async function fetchPageViews(): Promise<PageView[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, path, created_at, metadata')
    .eq('type', 'pageview')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    path: row.path,
    created_at: row.created_at,
    referrer: row.metadata?.referrer ?? null,
    device: row.metadata?.device ?? null
  }));
}

export async function fetchEventSummary(): Promise<EventSummary> {
  const { data, error } = await supabase
    .rpc('events_summary'); // you can implement this as a Supabase function

  if (error || !data) {
    return {
      totalVisits: 0,
      uniquePaths: 0,
      avgPerDay: 0
    };
  }

  return {
    totalVisits: data.total_visits,
    uniquePaths: data.unique_paths,
    avgPerDay: data.avg_per_day
  };
}

export async function fetchEngagementMetrics(): Promise<EngagementMetrics> {
  const { data, error } = await supabase.rpc('engagement_metrics');

  if (error || !data) {
    return {
      bounceRate: 0,
      avgSessionDurationSeconds: 0,
      avgScrollDepthPercent: 0
    };
  }

  return {
    bounceRate: data.bounce_rate,
    avgSessionDurationSeconds: data.avg_session_duration_seconds,
    avgScrollDepthPercent: data.avg_scroll_depth_percent
  };
}

export async function fetchSourceBreakdown(): Promise<SourceBreakdown[]> {
  const { data, error } = await supabase.rpc('source_breakdown');

  if (error || !data) return [];
  return data.map((row: any) => ({
    label: row.source,
    value: row.count
  }));
}
