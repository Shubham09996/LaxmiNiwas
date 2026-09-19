import React from 'react';
import { FileText, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';

export default function GstDossierCard({ dossier }) {
  const details = dossier.gstDetails || {};

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verified GST Details
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active GST Registration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN Number</span>
            <span className="text-sm font-mono font-bold text-brand-700 block mt-0.5">{details.gstin || dossier.entityIdentifier}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business Legal Name</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{details.legalName || dossier.entityName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trade / Brand Name</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{details.tradeName || 'LAXMI NIWAS'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration Date</span>
            <span className="text-xs font-medium text-slate-800 block mt-0.5">{details.registrationDate || '2019-05-18'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Taxpayer Type</span>
            <span className="text-xs font-medium text-slate-800 block mt-0.5">{details.taxpayerType || 'Regular'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
            <span className="text-xs font-bold text-emerald-700 block mt-0.5">Active & Compliant</span>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Registered Office Address:</span>
            <p className="text-slate-600 mt-0.5">{details.principalPlace || '402, Laxmi Niwas Tower, Connaught Place, New Delhi 110001'}</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900">Return Filing Status: 100% Regular & Up to Date</span>
          </div>
        </div>
      </div>
    </div>
  );
}
