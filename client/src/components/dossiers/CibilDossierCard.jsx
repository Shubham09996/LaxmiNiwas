import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function CibilDossierCard({ dossier }) {
  const details = dossier.cibilDetails || {};
  const score = details.creditScore || details.score || null;
  const summary = details.summary || {};
  const accounts = details.accounts || details.tradelines || [];
  const inquiries = details.recentInquiries || [];

  const percentage = score ? Math.round(((score - 300) / 600) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Credit Score Gauge Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Official Credit Score & Summary
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            CIBIL Bureau Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 items-center">
          {/* Score Gauge */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-sky-50/40 to-white border border-sky-100 flex flex-col items-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight tnum">
                  {score || '—'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {score ? 'out of 900' : 'Score Pending'}
                </span>
              </div>
            </div>

            <span className="mt-3 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {score ? (score >= 750 ? 'Prime Credit' : 'Bureau File Active') : 'Report Generated'}
            </span>
          </div>

          {/* Highlights Grid */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Loans & Cards
              </span>
              <span className="text-base font-bold text-slate-900 tnum block mt-0.5">
                {summary.totalAccounts !== undefined ? summary.totalAccounts : accounts.length || '—'}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">{summary.activeAccounts !== undefined ? `${summary.activeAccounts} Active` : 'Bureau File'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Sanctioned Limit
              </span>
              <span className="text-base font-bold text-slate-900 tnum block mt-0.5">
                {summary.totalSanctionedLimit ? `₹ ${Number(summary.totalSanctionedLimit).toLocaleString('en-IN')}` : '—'}
              </span>
              <span className="text-[11px] text-slate-500">Credit Line</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Outstanding
              </span>
              <span className="text-base font-bold text-slate-900 tnum block mt-0.5">
                {summary.currentBalance ? `₹ ${Number(summary.currentBalance).toLocaleString('en-IN')}` : '—'}
              </span>
              <span className="text-[11px] text-slate-500">Balance</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Credit Card Usage
              </span>
              <span className="text-base font-bold text-emerald-600 tnum block mt-0.5">
                {summary.creditUtilizationRatio || '—'}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Utilization</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Payment Track
              </span>
              <span className="text-base font-bold text-emerald-600 tnum block mt-0.5">
                {summary.paymentTrack || 'Verified'}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Bureau History</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Missed Payments
              </span>
              <span className="text-base font-bold text-emerald-600 tnum block mt-0.5">
                {summary.overdueAccounts !== undefined ? `${summary.overdueAccounts} Overdue` : 'Clean'}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Late Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Credit Accounts Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Loans & Credit Cards List
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {accounts.length} Accounts Found
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Bank / Lender</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Account Number</th>
                <th className="py-2.5 px-3 text-right">Loan Amount</th>
                <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                <th className="py-2.5 px-3 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{acc.lender}</td>
                  <td className="py-3 px-3 text-slate-600">{acc.accountType}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{acc.accountNumber}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                    ₹ {acc.sanctionAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                    ₹ {acc.currentBalance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {acc.status}
                    </span>
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
