import React from 'react';

interface Incident {
  id: string;
  provider: 'AWS' | 'Azure';
  service: string;
  region: string;
  status: string;
  started_at: string;
}

interface Props {
  incidents: Incident[];
}

const IncidentsTable: React.FC<Props> = ({ incidents }) => {
  return (
    <div className="bg-pw_panel border border-slate-800 rounded-xl p-4 shadow-lg shadow-slate-900/40">
      <div className="flex justify-between mb-3">
        <p className="text-xs text-pw_muted">
          Incidents impacting your cloud regions
        </p>
      </div>
      <div className="max-h-[260px] overflow-y-auto text-xs">
        <table className="w-full text-left border-collapse">
          <thead className="text-pw_muted border-b border-slate-800">
            <tr>
              <th className="py-2 pr-4">Provider</th>
              <th className="py-2 pr-4">Service</th>
              <th className="py-2 pr-4">Region</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Started</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((i) => (
              <tr key={i.id} className="border-b border-slate-900/60">
                <td className="py-2 pr-4 text-slate-100">{i.provider}</td>
                <td className="py-2 pr-4 text-pw_muted">{i.service}</td>
                <td className="py-2 pr-4 text-pw_muted">{i.region}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] ${
                      i.status === 'Resolved'
                        ? 'bg-emerald-900/40 text-emerald-300'
                        : 'bg-amber-900/40 text-amber-300'
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-pw_muted">
                  {new Date(i.started_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {!incidents.length && (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-pw_muted"
                >
                  No incidents logged.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentsTable;
