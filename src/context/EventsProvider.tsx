import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { EventsContext, RANGES, type RangeKey, type RealtimeStatus } from './eventsContext';
import { normalizeEvent, type TrackedEvent } from '../lib/events';
import type { InteractionEventRow } from '../lib/database.types';
import { fetchEventsSince } from '../lib/queries';
import { supabase } from '../lib/supabaseClient';

interface LoadState {
  all: TrackedEvent[];
  /** Identifies the last completed load (range + reload counter). */
  loadedKey: string;
  error: string | null;
  truncated: boolean;
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<RangeKey>('7d');
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<LoadState>({ all: [], loadedKey: '', error: null, truncated: false });
  const [realtime, setRealtime] = useState<RealtimeStatus>('connecting');
  const [now, setNow] = useState(() => Date.now());

  const requestKey = `${range}:${reloadToken}`;

  useEffect(() => {
    let active = true;
    // Fetch two periods so the dashboard can show real period-over-period deltas.
    fetchEventsSince(Date.now() - RANGES[range].ms * 2)
      .then((result) => {
        if (!active) return;
        setState({ all: result.events, loadedKey: requestKey, error: null, truncated: result.truncated });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState({ all: [], loadedKey: requestKey, error: `Could not load events: ${message}`, truncated: false });
      });
    return () => {
      active = false;
    };
  }, [range, requestKey]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  // Realtime feed of new events; no polling.
  useEffect(() => {
    const channel = supabase
      .channel('ops-interaction-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'interaction_events' }, (payload) => {
        const incoming = normalizeEvent(payload.new as InteractionEventRow);
        setState((current) =>
          current.all.some((event) => event.id === incoming.id)
            ? current
            : { ...current, all: [incoming, ...current.all] },
        );
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtime('live');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setRealtime('offline');
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Keeps "active now" / "x ago" labels honest without touching the network.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  // Refresh when the operator returns to the tab (covers missed realtime messages).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  const value = useMemo(() => {
    const boundary = now - RANGES[range].ms;
    const events = state.all.filter((event) => event.ts >= boundary);
    const previousEvents = state.all.filter((event) => event.ts < boundary);
    return {
      range,
      setRange,
      events,
      previousEvents,
      loading: state.loadedKey !== requestKey,
      error: state.error,
      truncated: state.truncated,
      realtime,
      now,
      lastEventAt: state.all.length ? state.all[0].ts : null,
      refresh,
    };
  }, [range, state, requestKey, realtime, now, refresh]);

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}
