import { useCallback, useEffect, useState } from 'react';
import { fetchAnalyticsEvents, type AnalyticsEvent } from '../lib/analytics';

interface AnalyticsState {
  events: AnalyticsEvent[];
  loading: boolean;
  error: string | null;
}

export function useAnalyticsEvents(limit = 1000) {
  const [state, setState] = useState<AnalyticsState>({
    events: [],
    loading: true,
    error: null
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const events = await fetchAnalyticsEvents(limit);
      setState({ events, loading: false, error: null });
    } catch {
      setState({
        events: [],
        loading: false,
        error: 'Analytics data is unavailable. Check the Supabase connection.'
      });
    }
  }, [limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
