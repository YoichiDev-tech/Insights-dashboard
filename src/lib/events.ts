import type { InteractionEventRow, Json } from './database.types';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';

export interface TrackedEvent {
  id: string;
  kind: 'pageview' | 'action';
  name: string;
  path: string;
  intent: 'audit' | 'build' | null;
  sessionId: string;
  /** ip_hash when the platform recorded one, otherwise the session id */
  visitorKey: string;
  ts: number;
  device: DeviceType;
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  landingPath: string;
  metadata: Record<string, Json | undefined>;
}

export function asRecord(value: Json | undefined): Record<string, Json | undefined> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {};
}

export function asString(value: Json | undefined): string {
  return typeof value === 'string' ? value : '';
}

export function asStringArray(value: Json | undefined): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

const BOT_PATTERN =
  /bot|crawler|spider|crawl|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|vercel|uptime|monitor|curl|wget|python-requests/i;

export function classifyDevice(userAgent: string | null): DeviceType {
  if (!userAgent) return 'unknown';
  if (BOT_PATTERN.test(userAgent)) return 'bot';
  if (/ipad|tablet|playbook|silk/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent))) {
    return 'tablet';
  }
  if (/mobi|iphone|ipod|android/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

export function normalizeEvent(row: InteractionEventRow): TrackedEvent {
  const metadata = asRecord(row.metadata);
  const attribution = asRecord(metadata.attribution);
  return {
    id: row.id,
    kind: row.kind === 'pageview' ? 'pageview' : 'action',
    name: row.event_name,
    path: row.path ?? '/',
    intent: row.intent === 'audit' || row.intent === 'build' ? row.intent : null,
    sessionId: row.session_id,
    visitorKey: row.ip_hash ?? row.session_id,
    ts: new Date(row.created_at).getTime(),
    device: classifyDevice(row.user_agent),
    source: asString(attribution.source) || 'unknown',
    medium: asString(attribution.medium) || 'unknown',
    campaign: asString(attribution.campaign),
    referrer: asString(attribution.referrer),
    landingPath: asString(attribution.landingPath),
    metadata,
  };
}

/** Event names the Studio tracker can emit (src/lib/track.ts). */
export const CONVERSION_EVENTS = new Set([
  'contact_submitted',
  'audit_lead_captured',
  'audit_teardown_requested',
  'booking_completed',
]);
