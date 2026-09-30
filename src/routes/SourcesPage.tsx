import { useCallback, useMemo } from 'react';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import Empty from '../components/analytics/Empty';
import MetricCard from '../components/analytics/MetricCard';
import PageHeader from '../components/analytics/PageHeader';
import Panel from '../components/analytics/Panel';
import RankedList from '../components/analytics/RankedList';
import { useEvents } from '../hooks/useEvents';
import { useRemote } from '../hooks/useRemote';
import { leadAttribution } from '../lib/leads';
import type { LeadRow } from '../lib/database.types';
import { countBy, humanOnly, summarizeSessions, topEntries } from '../lib/metrics';
import { fetchLeads } from '../lib/queries';

const NO_LEADS: LeadRow[] = [];

export default function SourcesPage() {
  const { events, loading, range } = useEvents();
  const fetchAllLeads = useCallback(() => fetchLeads(), []);
  const leads = useRemote(fetchAllLeads, NO_LEADS);

  const view = useMemo(() => {
    const sessions = summarizeSessions(humanOnly(events)).filter((session) => session.pageviews > 0);
    const sources = countBy(sessions, (session) => session.source);
    const mediums = [...countBy(sessions, (session) => session.medium).entries()].map(([name, value]) => ({ name, value }));
    const campaigns = countBy(
      sessions.filter((session) => session.campaign),
      (session) => session.campaign,
    );
    const landing = countBy(sessions, (session) => session.landingPath || '/');
    const leadSources = countBy(leads.data, (lead) => leadAttribution(lead).source);
    return { sessions, sources, mediums, campaigns, landing, leadSources };
  }, [events, leads.data]);

  const topSources = topEntries(view.sources, 8).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Traffic Sources"
        description={`First-touch attribution per session (UTM parameters, otherwise the referring site). ${range === '24h' ? 'Last 24 hours.' : ''}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Sessions" value={loading ? '...' : view.sessions.length} />
        <MetricCard label="Distinct sources" value={loading ? '...' : view.sources.size} />
        <MetricCard label="Leads (all time)" value={leads.loading ? '...' : leads.data.length} detail="Attribution stored with each lead" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Top sources" description="Sessions by first-touch source.">
          {topSources.length ? <BarChart data={topSources} color="#ffb84d" /> : <Empty>No sessions recorded in this period.</Empty>}
        </Panel>
        <Panel title="Mediums" description="direct, referral, or the utm_medium you set.">
          {view.mediums.length ? <PieChart data={view.mediums} /> : <Empty>No sessions recorded in this period.</Empty>}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Campaigns" description="Only sessions that carried a utm_campaign.">
          <RankedList rows={topEntries(view.campaigns, 8)} emptyMessage="No tagged campaigns in this period." />
        </Panel>
        <Panel title="Landing pages">
          <RankedList rows={topEntries(view.landing, 8)} emptyMessage="No sessions recorded in this period." />
        </Panel>
        <Panel title="Lead sources" description="Where submitted leads originally came from.">
          <RankedList rows={topEntries(view.leadSources, 8)} emptyMessage="No leads submitted yet." />
        </Panel>
      </div>
    </div>
  );
}
