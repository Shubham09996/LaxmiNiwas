import React from 'react';
import { Layers } from 'lucide-react';
import { useVerification } from '../../context/VerificationContext.jsx';

export default function ServiceBreakdown() {
  const { metrics } = useVerification();
  const distribution = metrics?.serviceDistribution || [
    { name: 'PAN Card Checks', count: 52100, percentage: 35, color: 'bg-emerald-600' },
    { name: 'Aadhaar Card Checks', count: 41700, percentage: 28, color: 'bg-emerald-500' },
    { name: 'Credit Score Checks', count: 23800, percentage: 16, color: 'bg-sky-600' },
    { name: 'Bank Account Checks', count: 17800, percentage: 12, color: 'bg-indigo-600' },
    { name: 'GST Number Checks', count: 8900, percentage: 6, color: 'bg-amber-500' },
    { name: 'Company Checks', count: 4620, percentage: 3, color: 'bg-pink-500' }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Checks by Category
              </h3>
              <p className="text-xs text-slate-500">Breakdown of verifications</p>
            </div>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="mt-5 h-3 w-full rounded-full bg-slate-100 flex overflow-hidden">
          {distribution.map((item, idx) => (
            <div
              key={idx}
              style={{ width: `${item.percentage}%` }}
              className={`${item.color} transition-all duration-500`}
              title={`${item.name}: ${item.percentage}%`}
            />
          ))}
        </div>

        {/* Distribution List */}
        <div className="mt-5 space-y-3">
          {distribution.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`} />
                <span className="font-semibold text-slate-800 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 font-mono">
                <span className="text-slate-500">{item.count.toLocaleString('en-IN')} checks</span>
                <span className="font-bold text-slate-900 w-9 text-right">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
