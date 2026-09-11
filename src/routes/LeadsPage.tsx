import React, { useEffect, useState } from 'react';
import {
  fetchLeads,
  updateLeadStatus,
  type Lead,
  type LeadStatus,
} from '../lib/analytics';

const statuses: LeadStatus[] = ['new', 'contacted', 'booked', 'qualified', 'won', 'lost'];

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    try {
      setLeads(await fetchLeads());
      setError(null);
    } catch {
      setError('Lead data is unavailable. Run the Studio Supabase schema and check the connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    void fetchLeads()
      .then((data) => {
        if (!cancelled) {
          setLeads(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Lead data is unavailable. Run the Studio Supabase schema and check the connection.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const changeStatus = async (lead: Lead, status: LeadStatus) => {
    const previous = lead.status;
    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status } : item));
    try {
      await updateLeadStatus(lead.id, status);
    } catch {
      setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status: previous } : item));
      setError('The lead status could not be updated.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Leads</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Every inquiry, audit context, source, and follow-up stage in one place.</p>
          </div>
          <button type="button" onClick={() => void loadLeads()} disabled={loading} className="min-h-11 rounded-md border border-sky-200 px-3 py-2 text-xs font-medium text-sky-800 transition hover:bg-sky-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{loading ? 'Refreshing...' : 'Refresh leads'}</button>
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statuses.map((status) => (
          <div key={status} className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{status}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{leads.filter((lead) => lead.status === status).length}</p>
          </div>
        ))}
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
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading leads...</td></tr>}
            {!loading && !leads.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No leads have been submitted yet.</td></tr>}
            {leads.map((lead) => (
              <React.Fragment key={lead.id}>
              <tr onClick={() => setSelectedId((current) => current === lead.id ? null : lead.id)} className="cursor-pointer align-top hover:bg-sky-50/60 dark:hover:bg-slate-900/60">
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.email}</p>
                  {lead.business && <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.business}</p>}
                </td>
                <td className="px-4 py-4 capitalize text-slate-700 dark:text-slate-200">{lead.intent}</td>
                <td className="max-w-xs px-4 py-4 text-slate-700 dark:text-slate-200">
                  {lead.audit_score !== null && <p className="font-semibold">Audit score: {lead.audit_score}/100</p>}
                  <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.scope_estimate ?? lead.site_url ?? lead.idea ?? 'No scope context'}</p>
                  <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{lead.audit_findings?.length ?? 0} finding(s) · click for details</p>
                </td>
                <td className="px-4 py-4 text-xs text-slate-600 dark:text-pw_muted"><p>{lead.attribution?.source ?? 'direct'}</p><p className="mt-1 text-slate-400">{lead.attribution?.campaign || lead.attribution?.medium || '—'}</p></td>
                <td className="px-4 py-4">
                  <select
                    value={lead.status}
                    onChange={(event) => void changeStatus(lead, event.target.value as LeadStatus)}
                    className="rounded-md border border-sky-200 bg-transparent px-2 py-1.5 text-xs capitalize text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500 dark:text-pw_muted">{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(lead.created_at))}</td>
              </tr>
              {selectedId === lead.id && <tr className="bg-sky-50/50 dark:bg-slate-900/40"><td colSpan={6} className="px-4 py-4"><div className="grid gap-4 text-sm md:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-pw_muted">Message</p><p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200">{lead.message}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-pw_muted">Audit findings</p>{lead.audit_findings?.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">{lead.audit_findings.map((finding) => <li key={finding}>{finding}</li>)}</ul> : <p className="mt-2 text-slate-500">No audit findings attached.</p>}<p className="mt-3 text-xs text-slate-500 dark:text-pw_muted">Session: {lead.session_id ?? 'not recorded'} · Last updated: {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lead.updated_at))}</p></div></div></td></tr>}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsPage;
