import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronDown,
  CreditCard,
  Fingerprint,
  TrendingUp,
  Building2,
  FileText,
  Landmark
} from 'lucide-react';
import { useVerification } from '../../context/VerificationContext.jsx';

export default function Header() {
  const { searchQuery, setSearchQuery } = useVerification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dossiers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const verifyOptions = [
    { name: 'Verify PAN Card', path: '/verify/pan', icon: CreditCard, subtitle: 'Check PAN status & name' },
    { name: 'Verify Aadhaar Card', path: '/verify/digilocker', icon: Fingerprint, subtitle: 'Check Aadhaar photo & address' },
    { name: 'Check Credit Score', path: '/verify/cibil', icon: TrendingUp, subtitle: 'View score & active loans' },
    { name: 'Verify Bank Account', path: '/verify/bank', icon: Landmark, subtitle: 'Check account holder name' },
    { name: 'Verify GST Number', path: '/verify/gst', icon: FileText, subtitle: 'Check business & filing status' },
    { name: 'Verify Company', path: '/verify/mca', icon: Building2, subtitle: 'Check directors & company details' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Simple Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, PAN, Aadhaar, or Report ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 shadow-2xs transition-all"
          />
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All Services Active</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Check</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-elevation-3 z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Choose What to Verify
                    </span>
                  </div>
                  <div className="py-1 space-y-0.5">
                    {verifyOptions.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.path}
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate(opt.path);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
                              {opt.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {opt.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
