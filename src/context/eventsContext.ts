import { createContext } from 'react';
import type { TrackedEvent } from '../lib/events';

export type RangeKey = '24h' | '7d' | '30d';

export const RANGES: Record<RangeKey, { label: string; days: number; ms: number }> = {
  '24h': { label: 'Last 24 hours', days: 1, ms: 24 * 60 * 60 * 1000 },
  '7d': { label: 'Last 7 days', days: 7, ms: 7 * 24 * 60 * 60 * 1000 },
  '30d': { label: 'Last 30 days', days: 30, ms: 30 * 24 * 60 * 60 * 1000 },
};

export type RealtimeStatus = 'connecting' | 'live' | 'offline';

export interface EventsContextValue {
  range: RangeKey;
  setRange: (range: RangeKey) => void;
  /** Events inside the selected range, newest first (bots included). */
  events: TrackedEvent[];
  /** Events in the equally long period before the selected range, for deltas. */
  previousEvents: TrackedEvent[];
  loading: boolean;
  error: string | null;
  truncated: boolean;
  realtime: RealtimeStatus;
  now: number;
  lastEventAt: number | null;
  refresh: () => void;
}

export const EventsContext = createContext<EventsContextValue | undefined>(undefined);
