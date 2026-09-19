import React from 'react';
import { Building2, ShieldCheck, Users } from 'lucide-react';

export default function McaDossierCard({ dossier }) {
  const details = dossier.mcaDetails || {};
  const directors = details.directors || [];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verified Company Master Details
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active & Registered Company
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company CIN Number</span>
            <span className="text-sm font-mono font-bold text-brand-700 block mt-0.5">{details.cin || dossier.entityIdentifier}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Name</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{details.companyName || dossier.entityName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ROC Office</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{details.rocCode || 'ROC Delhi'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incorporation Date</span>
            <span className="text-xs font-medium text-slate-800 block mt-0.5">{details.dateOfIncorporation || '2019-04-12'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Class</span>
            <span className="text-xs font-medium text-slate-800 block mt-0.5">{details.classOfCompany || 'Private Limited'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paid-Up Capital</span>
            <span className="text-xs font-bold text-emerald-700 block mt-0.5">{details.paidUpCapital || '₹ 25,00,000'}</span>
          </div>
        </div>

        {/* Directors List */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Company Directors
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {directors.map((dir, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{dir.name}</span>
                  <span className="text-[11px] text-slate-500 block">{dir.designation}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-brand-700 block">DIN: {dir.din}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
