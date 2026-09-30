import { useMemo } from 'react';
import Empty from '../components/analytics/Empty';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import RankedList from '../components/analytics/RankedList';
import { useEvents } from '../hooks/useEvents';
import { asString, CONVERSION_EVENTS } from '../lib/events';
import { countBy, eventLabel, humanOnly, topEntries } from '../lib/metrics';

export default function InteractionsPage() {
  const { events, loading } = useEvents();

  const view = useMemo(() => {
    const actions = humanOnly(events).filter((event) => event.kind === 'action');
    const clicks = actions.filter((event) => event.name === 'cta_click');
    const byLabel = countBy(clicks, (event) => {
      const label = asString(event.metadata.label) || 'Unlabelled CTA';
      const location = asString(event.metadata.location);
      return location ? `${label} (${location})` : label;
    });
    return {
      actions,
      byName: countBy(actions, (event) => event.name),
      byLabel,
      byPage: countBy(actions, (event) => event.path),
      conversions: actions.filter((event) => CONVERSION_EVENTS.has(event.name)).length,
      chatOpened: actions.filter((event) => event.name === 'chat_opened').length,
      chatMessages: actions.filter((event) => event.name === 'chat_message_sent').length,
      clicks: clicks.length,
    };
  }, [events]);

  const show = (value: number) => (loading ? '...' : value);

  return (
    <div className="space-y-6">
      <PageHeader title="Interactions" description="Clicks, chats, audits and conversion actions captured by the platform tracker." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Actions" value={show(view.actions.length)} />
        <MetricCard label="CTA clicks" value={show(view.clicks)} />
        <MetricCard label="Conversions" value={show(view.conversions)} detail="Contact, lead, teardown, booking" />
        <MetricCard label="Chats opened" value={show(view.chatOpened)} />
        <MetricCard label="Chat messages" value={show(view.chatMessages)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Action mix">
          <RankedList rows={topEntries(view.byName, 12)} format={eventLabel} emptyMessage="No actions recorded in this period." />
        </Panel>
        <Panel title="CTA buttons" description="Which calls to action get clicked, and where they sit.">
          <RankedList rows={topEntries(view.byLabel, 10)} emptyMessage="No CTA clicks recorded in this period." />
        </Panel>
      </div>

      <Panel title="Pages that drive actions">
        {view.actions.length ? <RankedList rows={topEntries(view.byPage, 10)} emptyMessage="" /> : <Empty>No actions recorded in this period.</Empty>}
      </Panel>
    </div>
  );
}
