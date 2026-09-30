import type { TrackedEvent } from './events';

export const DAY_MS = 24 * 60 * 60 * 1000;

export function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

export function topEntries(counts: Map<string, number>, limit = 10): Array<[string, number]> {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function humanOnly(events: TrackedEvent[]): TrackedEvent[] {
  return events.filter((event) => event.device !== 'bot');
}

export function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;
}

export function delta(current: number, previous: number): { label: string; tone: 'up' | 'down' | 'flat' } {
  if (previous === 0) return current === 0 ? { label: 'no change', tone: 'flat' } : { label: 'new activity', tone: 'up' };
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return { label: '0% vs previous period', tone: 'flat' };
  return { label: `${change > 0 ? '+' : ''}${change}% vs previous period`, tone: change > 0 ? 'up' : 'down' };
}

export interface SessionSummary {
  id: string;
  start: number;
  end: number;
  durationMs: number;
  events: number;
  pageviews: number;
  actions: number;
  landingPath: string;
  source: string;
  medium: string;
  campaign: string;
  device: TrackedEvent['device'];
  visitorKey: string;
  names: Set<string>;
}

export function summarizeSessions(events: TrackedEvent[]): SessionSummary[] {
  const sorted = [...events].sort((a, b) => a.ts - b.ts);
  const map = new Map<string, SessionSummary>();
  for (const event of sorted) {
    const existing = map.get(event.sessionId);
    if (!existing) {
      map.set(event.sessionId, {
        id: event.sessionId,
        start: event.ts,
        end: event.ts,
        durationMs: 0,
        events: 1,
        pageviews: event.kind === 'pageview' ? 1 : 0,
        actions: event.kind === 'action' ? 1 : 0,
        landingPath: event.kind === 'pageview' ? event.path : event.landingPath || event.path,
        source: event.source,
        medium: event.medium,
        campaign: event.campaign,
        device: event.device,
        visitorKey: event.visitorKey,
        names: new Set([event.name]),
      });
      continue;
    }
    existing.end = event.ts;
    existing.durationMs = existing.end - existing.start;
    existing.events += 1;
    if (event.kind === 'pageview') existing.pageviews += 1;
    else existing.actions += 1;
    existing.names.add(event.name);
  }
  return [...map.values()];
}

export function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Continuous daily series (days without events are genuine zeros). */
export function dailySeries(
  events: TrackedEvent[],
  days: number,
  now: number,
): Array<{ name: string; value: number }> {
  const counts = countBy(events, (event) => dayKey(event.ts));
  const series: Array<{ name: string; value: number }> = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const key = dayKey(now - offset * DAY_MS);
    series.push({ name: key.slice(5), value: counts.get(key) ?? 0 });
  }
  return series;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return '0s';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function formatDate(ts: number | string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts));
}

export function timeAgo(ts: number, now: number): string {
  const seconds = Math.max(0, Math.round((now - ts) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function eventLabel(name: string): string {
  return name.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const HOUR_MS = 60 * 60 * 1000;

/** 24 hourly buckets ending at `now`. */
export function hourlySeries(events: TrackedEvent[], now: number): Array<{ name: string; value: number }> {
  const start = Math.floor(now / HOUR_MS) * HOUR_MS - 23 * HOUR_MS;
  const buckets = new Array<number>(24).fill(0);
  for (const event of events) {
    const index = Math.floor((event.ts - start) / HOUR_MS);
    if (index >= 0 && index < 24) buckets[index] += 1;
  }
  return buckets.map((value, index) => ({
    name: `${String(new Date(start + index * HOUR_MS).getHours()).padStart(2, '0')}:00`,
    value,
  }));
}

/** Daily buckets for multi-day ranges, hourly buckets for the 24h range. */
export function trendSeries(events: TrackedEvent[], days: number, now: number): Array<{ name: string; value: number }> {
  return days <= 1 ? hourlySeries(events, now) : dailySeries(events, days, now);
}

export function hourOfDaySeries(events: TrackedEvent[]): Array<{ name: string; value: number }> {
  const buckets = new Array<number>(24).fill(0);
  for (const event of events) buckets[new Date(event.ts).getHours()] += 1;
  return buckets.map((value, hour) => ({ name: String(hour).padStart(2, '0'), value }));
}

/** Sessions with at least two events -- the only ones with a measurable duration. */
export function measurableDurations(sessions: SessionSummary[]): number[] {
  return sessions.filter((session) => session.events > 1).map((session) => session.durationMs);
}

export function isBounce(session: SessionSummary): boolean {
  return session.pageviews <= 1 && session.actions === 0;
}

export function csvCell(value: string | number | null): string {
  let text = value === null ? '' : String(value);
  // Neutralise spreadsheet formula injection: metadata comes from public visitors.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
