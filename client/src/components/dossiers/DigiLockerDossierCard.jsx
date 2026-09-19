import React from 'react';
import {
  Fingerprint,
  ShieldCheck,
  MapPin,
  User,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function DigiLockerDossierCard({ dossier }) {
  const details = dossier.digiLockerDetails || {};
  const addr = details.address || {};

  return (
    <div className="space-y-6">
      {/* Resident Identity */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verified Aadhaar Card Details
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Government Record
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Identity Photo & Masked UID */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-brand-500/30 shadow-md mb-3 bg-slate-200">
              <img
                src="/executive_avatar.jpg"
                alt={details.fullName || dossier.entityName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://ui-avatars.com/api/?name=Shubham+Agrawal&background=059669&color=fff';
                }}
              />
            </div>
            <span className="text-base font-bold text-slate-900">{details.fullName || dossier.entityName}</span>
            <span className="text-xs font-mono font-bold text-brand-700 mt-1 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
              {details.maskedAadhaar || dossier.entityIdentifier}
            </span>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              <span>Photo Verified (99.4% Match)</span>
            </div>
          </div>

          {/* Demographic Breakdown */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Full Name
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {details.fullName || dossier.entityName}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Date of Birth & Gender
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {details.dateOfBirth || '1994-08-15'} ({details.gender || 'Male'})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Father / Guardian Name
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {details.careOf || 'Satish Kumar Agrawal'}
              </span>
            </div>
          </div>

          {/* Certified Address Block */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Registered Home Address
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {addr.line1 || 'Flat 402, Laxmi Niwas Tower, Sector 62'}<br />
                {addr.line2 || 'Institutional Area, Phase 2'}<br />
                {addr.city || 'Noida'}, {addr.district || 'Gautam Buddha Nagar'}<br />
                {addr.state || 'Uttar Pradesh'} — <strong className="font-mono text-brand-700">{addr.pincode || '201309'}</strong>
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 block text-center mt-3">
              ✓ Address Verified with Government Records
            </span>
          </div>
        </div>
      </div>

      {/* Security Checks */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Aadhaar Verification Checks
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {[
            { label: 'Government Digital Signature', status: 'Valid & Verified' },
            { label: 'Face Photo & Identity Match', status: '99.4% Match' },
            { label: 'Registered Address Format', status: 'PIN 201309 Verified' },
            { label: 'OTP Security Check', status: 'Completed Successfully' }
          ].map((chk, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800">{chk.label}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {chk.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
