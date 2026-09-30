import { useCallback, useMemo } from 'react';
import Empty from '../components/analytics/Empty';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import { useEvents } from '../hooks/useEvents';
import { useRemote } from '../hooks/useRemote';
import type { AuditRow } from '../lib/database.types';
import { asRecord, asString } from '../lib/events';
import { average, countBy, formatDate, pct, timeAgo } from '../lib/metrics';
import { fetchAudits } from '../lib/queries';

const NO_AUDITS: AuditRow[] = [];
const DAY_MS = 24 * 60 * 60 * 1000;

function categoryScores(audit: AuditRow): Array<{ label: string; score: number }> {
  if (!Array.isArray(audit.categories)) return [];
  const scores: Array<{ label: string; score: number }> = [];
  for (const item of audit.categories) {
    const record = asRecord(item);
    const label = asString(record.label);
    const score = record.score;
    if (label && typeof score === 'number') scores.push({ label, score });
  }
  return scores;
}

export default function SystemHealthPage() {
  const { events, previousEvents, loading, realtime, now, lastEventAt } = useEvents();
  const fetchAllAudits = useCallback(() => fetchAudits(), []);
  const audits = useRemote(fetchAllAudits, NO_AUDITS);

  const tracker = useMemo(() => {
    const all = [...events, ...previousEvents];
    const last24h = all.filter((event) => now - event.ts <= DAY_MS);
    const bots = all.filter((event) => event.device === 'bot').length;
    return {
      last24h: last24h.length,
      botShare: pct(bots, all.length),
      byKind: countBy(all, (event) => event.kind),
      reportViews: all.filter((event) => event.name === 'audit_report_viewed').length,
    };
  }, [events, previousEvents, now]);

  const auditStats = useMemo(() => {
    const byCategory = new Map<string, number[]>();
    for (const audit of audits.data) {
      for (const { label, score } of categoryScores(audit)) {
        byCategory.set(label, [...(byCategory.get(label) ?? []), score]);
      }
    }
    return {
      avgOverall: average(audits.data.map((audit) => audit.overall_score)),
      categories: [...byCategory.entries()].map(([label, scores]) => ({ label, avg: average(scores) })),
    };
  }, [audits.data]);

  const stale = lastEventAt !== null && now - lastEventAt > DAY_MS;

  return (
    <div className="space-y-6">
      <PageHeader title="System Health" description="Is the tracker delivering data, and how is the audit engine performing?" hideRange />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Last event received"
          value={loading ? '...' : lastEventAt ? timeAgo(lastEventAt, now) : 'Never'}
          detail={stale ? 'No events in 24h - check the tracker' : lastEventAt ? formatDate(lastEventAt) : 'No events stored yet'}
          tone={stale || lastEventAt === null ? 'down' : 'up'}
        />
        <MetricCard label="Events (24h)" value={loading ? '...' : tracker.last24h} />
        <MetricCard
          label="Realtime stream"
          value={realtime === 'live' ? 'Live' : realtime === 'connecting' ? 'Connecting' : 'Offline'}
          tone={realtime === 'live' ? 'up' : realtime === 'offline' ? 'down' : 'flat'}
        />
        <MetricCard label="Bot traffic" value={loading ? '...' : `${tracker.botShare}%`} detail="Share of stored events, excluded from reports" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Audits run (stored)" value={audits.loading ? '...' : audits.data.length} />
        <MetricCard
          label="Avg. audit score"
          value={audits.loading ? '...' : audits.data.length ? Math.round(auditStats.avgOverall) : 'n/a'}
          detail="Overall score across saved audits"
        />
        <MetricCard label="Shared report views" value={loading ? '...' : tracker.reportViews} detail="audit_report_viewed events" />
      </div>

      {audits.error && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          Could not load audits: {audits.error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Average score by category" description="From saved audit reports.">
          {auditStats.categories.length ? (
            <ul className="space-y-3">
              {auditStats.categories.map((category) => (
                <li key={category.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-700 dark:text-slate-200">{category.label}</span>
                  <span className="font-semibold text-black dark:text-white">{Math.round(category.avg)}/100</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No audits have been saved yet.</Empty>
          )}
        </Panel>

        <Panel title="Recent audits" description="Websites audited through the platform widget.">
          {audits.data.length ? (
            <ul className="space-y-3">
              {audits.data.slice(0, 8).map((audit) => (
                <li key={audit.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="min-w-0 truncate text-slate-700 dark:text-slate-200" title={audit.final_url}>{audit.final_url}</span>
                  <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-black dark:text-white">{audit.overall_score}</strong>/100 - {timeAgo(new Date(audit.created_at).getTime(), now)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No audits have been saved yet.</Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}
