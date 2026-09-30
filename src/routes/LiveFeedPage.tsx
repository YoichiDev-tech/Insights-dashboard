import { useMemo } from 'react';
import EventTable from '../components/analytics/EventTable';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import { useEvents } from '../hooks/useEvents';
import { humanOnly } from '../lib/metrics';

const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

export default function LiveFeedPage() {
  const { events, loading, realtime, now } = useEvents();

  const view = useMemo(() => {
    const human = humanOnly(events);
    return {
      recent: human.slice(0, 100),
      active: new Set(human.filter((event) => now - event.ts <= ACTIVE_WINDOW_MS).map((event) => event.sessionId)).size,
    };
  }, [events, now]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Feed"
        description="New events stream in through Supabase Realtime as visitors use the platform."
        hideRange
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard label="Active now" value={loading ? '...' : view.active} detail="Sessions with an event in the last 5 min" />
        <MetricCard
          label="Stream"
          value={realtime === 'live' ? 'Live' : realtime === 'connecting' ? 'Connecting' : 'Offline'}
          detail={realtime === 'offline' ? 'Enable Realtime on interaction_events (see ops-setup.sql)' : 'Push updates, no polling'}
          tone={realtime === 'live' ? 'up' : realtime === 'offline' ? 'down' : 'flat'}
        />
      </div>
      <Panel title={loading ? 'Loading activity...' : `${view.recent.length} most recent events`}>
        <EventTable events={view.recent} now={now} emptyMessage="No events have been recorded yet." />
      </Panel>
    </div>
  );
}
