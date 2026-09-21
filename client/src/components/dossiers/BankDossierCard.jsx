import React from 'react';
import { Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BankDossierCard({ dossier }) {
  const details = dossier.bankDetails || {};

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verified Bank Account Details
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active & Verified Account
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Number</span>
            <span className="text-sm font-mono font-bold text-brand-700 block mt-0.5">{details.accountNumberMasked || dossier.entityIdentifier}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank & Branch</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{details.bankName || '—'}</span>
            {details.branchName && <span className="text-[11px] text-slate-500 block">{details.branchName}</span>}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code</span>
            <span className="text-sm font-mono font-bold text-slate-800 block mt-0.5">{details.ifscCode || details.ifsc || '—'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 md:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Name as per Bank Records</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5">{details.beneficiaryNameCBS || details.beneficiaryName || dossier.entityName || '—'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Status</span>
            <span className="text-sm font-bold text-emerald-600 block mt-0.5">{details.accountStatus || 'Active & Validated'}</span>
          </div>
        </div>

        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-900">CBS Status: {details.status || 'Active & Operational'}</span>
          </div>
          {details.npciRrn && <span className="font-mono text-[11px] text-emerald-700">Ref: {details.npciRrn}</span>}
        </div>
      </div>
    </div>
  );
}
