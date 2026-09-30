import { useMemo } from 'react';
import Empty from '../components/analytics/Empty';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import { useEvents } from '../hooks/useEvents';
import { humanOnly, pct } from '../lib/metrics';

const STAGES: ReadonlyArray<{ label: string; event: string }> = [
  { label: 'Visited the site', event: 'pageview' },
  { label: 'Started an audit', event: 'audit_run' },
  { label: 'Completed an audit', event: 'audit_completed' },
  { label: 'Requested the report (lead)', event: 'audit_lead_captured' },
  { label: 'Requested a teardown', event: 'audit_teardown_requested' },
  { label: 'Generated a revamp preview', event: 'revamp_preview_generated' },
  { label: 'Submitted the contact form', event: 'contact_submitted' },
  { label: 'Booked a call', event: 'booking_completed' },
];

export default function FunnelsPage() {
  const { events, loading } = useEvents();

  const funnel = useMemo(() => {
    const human = humanOnly(events);
    const counts = STAGES.map((stage) => ({
      ...stage,
      sessions: new Set(human.filter((event) => event.name === stage.event).map((event) => event.sessionId)).size,
    }));
    const base = counts[0]?.sessions ?? 0;
    return counts.map((stage) => ({ ...stage, share: pct(stage.sessions, base) }));
  }, [events]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funnels"
        description="Distinct sessions reaching each milestone. Stages are independent paths, not a strict sequence."
      />
      <Panel title="Conversion milestones" description="Percentages are relative to sessions that viewed the site.">
        {!loading && funnel[0]?.sessions === 0 ? (
          <Empty>No sessions recorded in this period.</Empty>
        ) : (
          <ul className="space-y-4">
            {funnel.map((stage) => (
              <li key={stage.event}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-700 dark:text-slate-200">{stage.label}</span>
                  <span className="font-semibold text-black dark:text-white">
                    {loading ? '...' : stage.sessions} <span className="text-xs font-normal text-slate-500">({stage.share}%)</span>
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-sky-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-sky-400 dark:bg-amber" style={{ width: `${stage.sessions ? Math.max(2, stage.share) : 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
