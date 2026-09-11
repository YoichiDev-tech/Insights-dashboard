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

  useEffect(() => {
    void (async () => {
      try {
        setLeads(await fetchLeads());
      } catch {
        setError('Lead data is unavailable. Run the Studio Supabase schema and check the connection.');
      } finally {
        setLoading(false);
      }
    })();
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
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Leads</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Every inquiry, audit context, source, and follow-up stage in one place.</p>
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
              <th className="px-4 py-3">Audit / scope</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 dark:divide-slate-800">
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading leads...</td></tr>}
            {!loading && !leads.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No leads have been submitted yet.</td></tr>}
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top hover:bg-sky-50/60 dark:hover:bg-slate-900/60">
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.email}</p>
                  {lead.business && <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.business}</p>}
                </td>
                <td className="px-4 py-4 capitalize text-slate-700 dark:text-slate-200">{lead.intent}</td>
                <td className="max-w-xs px-4 py-4 text-slate-700 dark:text-slate-200">
                  {lead.audit_score !== null && <p className="font-semibold">Audit score: {lead.audit_score}/100</p>}
                  <p className="mt-1 text-xs text-slate-500 dark:text-pw_muted">{lead.scope_estimate ?? lead.site_url ?? lead.idea ?? 'No scope context'}</p>
                </td>
                <td className="px-4 py-4 text-xs text-slate-600 dark:text-pw_muted">{lead.attribution?.source ?? 'direct'}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsPage;
