import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Fingerprint,
  TrendingUp,
  FileText,
  Landmark,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function QuickVerifyBar() {
  const navigate = useNavigate();

  const gateways = [
    { name: 'Verify PAN', desc: 'PAN number & name', path: '/verify/pan', icon: CreditCard, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'Verify Aadhaar', desc: 'Photo & address', path: '/verify/digilocker', icon: Fingerprint, color: 'text-brand-700 bg-brand-50 border-brand-200' },
    { name: 'Credit Score', desc: 'CIBIL score check', path: '/verify/cibil', icon: TrendingUp, color: 'text-sky-700 bg-sky-50 border-sky-200' },
    { name: 'Bank Account', desc: 'Name match & ₹1 test', path: '/verify/bank', icon: Landmark, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { name: 'GST Number', desc: 'Filing & business status', path: '/verify/gst', icon: FileText, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { name: 'Company Details', desc: 'ROC & directors check', path: '/verify/mca', icon: Building2, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Quick Verification Shortcuts
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any service below to verify details instantly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {gateways.map(g => {
          const Icon = g.icon;
          return (
            <button
              key={g.path}
              onClick={() => navigate(g.path)}
              className="flex flex-col items-start p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-300 hover:shadow-card-hover transition-all text-left group"
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-2.5 ${g.color} group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                {g.name}
              </span>
              <span className="text-[11px] text-slate-500 truncate mt-0.5 block w-full">
                {g.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
