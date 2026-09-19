import React, { useState } from 'react';
import {
  ShieldCheck,
  Search
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';

export default function AuditLogsPage() {
  const { auditLogs } = useVerification();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.service.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Activity History
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            See recent verification actions and activity records.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-2xs"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Name / ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{log.service}</span>
                    <span className="text-[11px] text-slate-500 block">{log.details}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={log.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
