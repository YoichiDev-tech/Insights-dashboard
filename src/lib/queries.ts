import { supabase } from './supabaseClient';
import type { AuditRow, LeadRow, LeadStatus } from './database.types';
import { normalizeEvent, type TrackedEvent } from './events';

const PAGE_SIZE = 1000;
export const MAX_EVENTS = 20000;

export interface EventsResult {
  events: TrackedEvent[];
  truncated: boolean;
}

/** Fetches every interaction event since `sinceMs`, newest first, paginating past the 1000-row API cap. */
export async function fetchEventsSince(sinceMs: number): Promise<EventsResult> {
  const since = new Date(sinceMs).toISOString();
  const events: TrackedEvent[] = [];
  let truncated = false;

  for (let from = 0; from < MAX_EVENTS; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('interaction_events')
      .select('id, kind, event_name, path, intent, session_id, metadata, ip_hash, user_agent, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(error.message);
    for (const row of data) events.push(normalizeEvent(row));
    if (data.length < PAGE_SIZE) return { events, truncated };
  }

  truncated = true;
  return { events, truncated };
}

export async function fetchLeads(limit = 500): Promise<LeadRow[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchAudits(limit = 500): Promise<AuditRow[]> {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data;
}
