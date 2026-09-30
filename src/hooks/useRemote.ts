import { useCallback, useEffect, useState } from 'react';

interface RemoteState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

/** Loads data once, and again whenever `reload` is called. */
export function useRemote<T>(fetcher: () => Promise<T>, initial: T) {
  const [state, setState] = useState<RemoteState<T>>({ data: initial, loading: true, error: null });

  const reload = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setState((current) => ({ ...current, loading: false, error: message }));
    }
  }, [fetcher]);

  useEffect(() => {
    let active = true;
    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState((current) => ({ ...current, loading: false, error: message }));
      });
    return () => {
      active = false;
    };
  }, [fetcher]);

  const setData = useCallback((updater: (current: T) => T) => {
    setState((current) => ({ ...current, data: updater(current.data) }));
  }, []);

  return { ...state, reload, setData };
}
