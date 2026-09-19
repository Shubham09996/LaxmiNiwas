import React from 'react';
import TopNav from './TopNav.jsx';

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#070B18] text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-1/3 w-[700px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      <TopNav />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-xl py-6 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight">Laxmi Niwas Verification Engine</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-medium">Customer Onboarding to Disbursement</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Gateway APIs Active
            </span>
            <span>•</span>
            <span className="text-indigo-400 font-bold">Fast • Reliable • Statutory</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
