import { Fragment, useCallback, useState } from 'react';
import PageHeader from '../components/analytics/PageHeader';
import { useRemote } from '../hooks/useRemote';
import type { LeadRow } from '../lib/database.types';
import { LEAD_STATUSES, leadAttribution, leadFindings, toLeadStatus } from '../lib/leads';
import { formatDate } from '../lib/metrics';
import { fetchLeads, updateLeadStatus } from '../lib/queries';
import type { LeadStatus } from '../lib/database.types';

const NO_LEADS: LeadRow[] = [];

export default function LeadsPage() {
  const load = useCallback(() => fetchLeads(), []);
  const { data: leads, loading, error, reload, setData } = useRemote(load, NO_LEADS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const changeStatus = async (lead: LeadRow, status: LeadStatus) => {
    const previous = lead.status;
    setUpdateError(null);
    setData((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)));
    try {
      await updateLeadStatus(lead.id, status);
    } catch {
      setData((current) => current.map((item) => (item.id === lead.id ? { ...item, status: previous } : item)));
      setUpdateError('The lead status could not be updated. Check that your operator account may update leads.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Every inquiry with its audit context, source and follow-up stage."
        hideRange
      />

      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">Could not load leads: {error}</p>}
      {updateError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{updateError}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {LEAD_STATUSES.map((status) => (
          <div key={status} className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{status}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {leads.filter((lead) => toLeadStatus(lead.status) === status).length}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void reload()}
          disabled={loading}
          className="min-h-11 rounded-md border border-sky-200 px-3 py-2 text-xs font-medium text-sky-800 transition hover:bg-sky-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {loading ? 'Refreshing...' : 'Refresh leads'}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-sky-100 bg-white/70 dark:border-slate-800 dark:bg-pw_panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-sky-100 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-pw_muted">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Intent</th>
              <th className="px-4 py-3">Context</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 dark:divide-slate-800">
            {loading && !leads.length && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading leads...</td></tr>
            )}
            {!loading && !error && !leads.length && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No leads have been submitted yet.</td></tr>
            )}
            {leads.map((lead) => {
              const findings = leadFindings(lead);
              const attribution = leadAttribution(lead);
              return (
                <Fragment key={lead.id}>
                  <tr
                    onClick={() => setSelectedId((current) => (current === lead.id ? null : lead.id))}
                    className="cursor-pointer align-top hover:bg-sky-50/60 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(event) => event.stopPropagation()}
                        className="mt-1 block text-xs text-sky-700 underline dark:text-amber"
                      >
                        {lead.email}
                      </a>
                      {lead.business && <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.business}</p>}
                    </td>
                    <td className="px-4 py-4 capitalize text-slate-700 dark:text-slate-200">{lead.intent}</td>
                    <td className="max-w-xs px-4 py-4 text-slate-700 dark:text-slate-200">
                      {lead.audit_score !== null && <p className="font-semibold">Audit score: {lead.audit_score}/100</p>}
                      <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.scope_estimate ?? lead.site_url ?? lead.idea ?? 'No scope context'}</p>
                      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{findings.length} finding(s) - click for details</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-pw_muted">
                      <p>{attribution.source}</p>
                      <p className="mt-1 text-slate-400">{attribution.campaign || attribution.medium || '-'}</p>
                    </td>
                    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                      <select
                        value={toLeadStatus(lead.status)}
                        onChange={(event) => void changeStatus(lead, toLeadStatus(event.target.value))}
                        aria-label={`Status for ${lead.name}`}
                        className="rounded-md border border-sky-200 bg-transparent px-2 py-1.5 text-xs capitalize text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status} className="text-slate-900">{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500 dark:text-pw_muted">{formatDate(lead.created_at)}</td>
                  </tr>
                  {selectedId === lead.id && (
                    <tr className="bg-sky-50/50 dark:bg-slate-900/40">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-4 text-sm md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-pw_muted">Message</p>
                            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200">{lead.message}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-pw_muted">Audit findings</p>
                            {findings.length ? (
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
                                {findings.map((finding) => <li key={finding}>{finding}</li>)}
                              </ul>
                            ) : (
                              <p className="mt-2 text-slate-500">No audit findings attached.</p>
                            )}
                            <p className="mt-3 text-xs text-slate-500 dark:text-pw_muted">
                              Session: {lead.session_id ?? 'not recorded'} - Last updated: {formatDate(lead.updated_at)}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
