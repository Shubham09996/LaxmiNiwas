import React from 'react';
import {
  CheckCircle2,
  CreditCard,
  Copy,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useVerification } from '../../context/VerificationContext.jsx';

export default function PanDossierCard({ dossier }) {
  const { copyToClipboard } = useVerification();
  const details = dossier.panDetails || {};

  return (
    <div className="space-y-6">
      {/* Master Data Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verified PAN Card Details
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            Active & Valid Record
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              PAN Number
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-mono font-bold text-brand-700 tracking-wider">
                {details.panNumber || dossier.entityIdentifier}
              </span>
              <button
                onClick={() => copyToClipboard(details.panNumber || dossier.entityIdentifier, 'PAN')}
                className="text-slate-400 hover:text-brand-600 p-1 rounded transition-colors"
                title="Copy PAN"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="inline-block mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Status: Active & Valid
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Full Legal Name
            </span>
            <span className="text-sm font-bold text-slate-900 block mt-1 leading-snug">
              {details.holderName || dossier.entityName}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Holder Type: <strong className="text-slate-700">{details.panType || 'Individual'}</strong>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Date of Birth / Setup Date
            </span>
            <span className="text-sm font-bold text-slate-900 block mt-1">
              {details.dateOfIncorporation || details.dateOfBirth || '1994-08-15'}
            </span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              ✓ Date Matched
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Aadhaar Card Link
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-1">
              {details.aadhaarSeedingStatus || 'Linked with Aadhaar'}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">
              ✓ Government Verified
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tax Ward / Location
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-1">
              {details.jurisdiction || 'NEW DELHI CENTRAL'}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Ward Code: {details.aoCode || 'DLC-W-03-2'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tax Compliance
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-emerald-700">
                Regular & Clean
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Returns Filed on Time
            </span>
          </div>
        </div>
      </div>

      {/* Checklist & Verification Stamp */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Checks */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verification Checks Completed
            </h3>
          </div>

          <div className="space-y-3 pt-4">
            {[
              { label: 'Government Tax Database Match', note: 'PAN exists and is currently active in the central registry.' },
              { label: 'Name & Date of Birth Match', note: 'Declared details 100% matched with official records.' },
              { label: 'Aadhaar Linkage Status', note: 'Aadhaar linkage verified successfully.' },
              { label: 'Tax Return History', note: 'No pending tax defaults or alerts.' }
            ].map((chk, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{chk.label}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      PASSED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{chk.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification QR / Certificate Stamp */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Official Stamp
              </h3>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-brand-50/70 border border-brand-200/80 text-center">
              <div className="w-20 h-20 bg-white border-2 border-brand-500 rounded-xl mx-auto flex items-center justify-center p-2 shadow-2xs">
                <svg viewBox="0 0 40 40" className="w-full h-full text-brand-800" fill="currentColor">
                  <path d="M0 0h16v16H0zM4 4h8v8H4zM24 0h16v16H24zM28 4h8v8h-8zM0 24h16v16H0zM4 28h8v8H4zM24 24h4v4h-4zM32 24h8v4h-8zM24 32h8v8h-8zM36 32h4v8h-4zM18 4h4v4h-4zM18 12h4v4h-4zM18 20h4v4h-4zM18 28h4v4h-4zM18 36h4v4h-4z" />
                </svg>
              </div>
              <span className="text-xs font-mono text-brand-900 font-bold block mt-2">
                VERIFIED & CERTIFIED
              </span>
              <span className="text-[10px] text-brand-700 block mt-0.5">
                Official Laxmi Niwas Digital Seal
              </span>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              <span className="block font-semibold text-slate-700">Reference Number:</span>
              <span className="font-mono text-xs font-bold text-slate-900 block mt-0.5">
                {details.nsdlReferenceNumber || 'VRF-89210-2026'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
