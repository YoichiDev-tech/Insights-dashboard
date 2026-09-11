import { supabase } from './supabaseClient';

export interface AnalyticsEvent {
  id: string;
  kind: string;
  event_name: string;
  session_id: string;
  metadata: Record<string, unknown>;
  intent: string | null;
  type: string;
  path: string;
  device: string | null;
  referrer: string | null;
  duration_ms: number | null;
  scroll_depth: number | null;
  chat_length: number | null;
  analysis_score: number | null;
  issues_count: number | null;
  user_id: string | null;
  created_at: string;
}

export async function fetchAnalyticsEvents(limit = 1000): Promise<AnalyticsEvent[]> {
  const { data, error } = await supabase
    .from('interaction_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) throw error ?? new Error('No analytics data returned');
  return (data as Omit<AnalyticsEvent, 'type'>[]).map((event) => ({
    ...event,
    type: event.event_name,
  }));
}

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'qualified' | 'won' | 'lost';

export interface Lead {
  id: string;
  intent: 'audit' | 'build';
  name: string;
  email: string;
  business: string | null;
  site_url: string | null;
  idea: string | null;
  message: string;
  session_id: string | null;
  audit_score: number | null;
  audit_findings: string[];
  scope_estimate: string | null;
  attribution: { source?: string; medium?: string; campaign?: string };
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export async function fetchLeads(limit = 200): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) throw error ?? new Error('No lead data returned');
  return data as Lead[];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw error;
}

export function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

export function eventLabel(type: string): string {
  return type
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDuration(durationMs: number): string {
  if (durationMs < 1000) return `${durationMs} ms`;
  const seconds = Math.round(durationMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function formatPath(path: string): string {
  return path || '/';
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}
