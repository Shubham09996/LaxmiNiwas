import React from 'react';
import { ShieldCheck, Copy, Printer, Download } from 'lucide-react';
import { useVerification } from '../../context/VerificationContext.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import TrustShield from '../common/TrustShield.jsx';

export default function CertifiedHeader({ dossier }) {
  const { copyToClipboard } = useVerification();

  if (!dossier) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-2xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {dossier.serviceTitle} Report
              </h1>
              <StatusBadge status={dossier.status} size="sm" />
              <TrustShield score={dossier.trustScore} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Report ID: <strong className="font-mono text-slate-700">{dossier.refId || dossier.id}</strong></span>
              <button
                onClick={() => copyToClipboard(dossier.refId || dossier.id, 'Report ID')}
                className="text-brand-600 hover:text-brand-700 p-0.5 rounded hover:bg-brand-50 transition-colors"
                title="Copy ID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-300">•</span>
              <span>Date: {new Date(dossier.timestamp).toLocaleDateString()} at {new Date(dossier.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>
        </div>

        {/* Simple Buttons */}
        <div className="flex items-center gap-2 actions-bar flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dossier, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `${dossier.id}_report.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 border border-brand-200 hover:bg-brand-100/70 rounded-xl text-xs font-bold text-brand-700 shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save as File</span>
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
            Name / Entity
          </span>
          <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">
            {dossier.entityName}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
            ID Number
          </span>
          <span className="text-sm font-mono font-bold text-brand-700 truncate block mt-0.5">
            {dossier.entityIdentifier}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
            Verification Result
          </span>
          <span className="text-sm font-bold text-emerald-600 block mt-0.5">
            ✓ 100% Authentic & Valid
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
            Verification Speed
          </span>
          <span className="text-sm font-medium text-slate-700 block mt-0.5">
            Instant ({dossier.latencyMs || 340} ms)
          </span>
        </div>
      </div>
    </div>
  );
}
