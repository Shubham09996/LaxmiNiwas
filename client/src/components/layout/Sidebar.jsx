import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Fingerprint,
  TrendingUp,
  FileText,
  Landmark,
  Building2,
  History,
  KeyRound,
  ShieldCheck,
  Settings,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const mainNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, exact: true },
    { name: 'Verify PAN Card', path: '/verify/pan', icon: CreditCard },
    { name: 'Verify Aadhaar Card', path: '/verify/digilocker', icon: Fingerprint },
    { name: 'Check Credit Score', path: '/verify/cibil', icon: TrendingUp },
    { name: 'Verify Bank Account', path: '/verify/bank', icon: Landmark },
    { name: 'Verify GST Number', path: '/verify/gst', icon: FileText },
    { name: 'Verify Company', path: '/verify/mca', icon: Building2 },
    { name: 'All Verification Reports', path: '/dossiers', icon: History },
  ];

  const adminNav = [
    { name: 'API Keys', path: '/api-keys', icon: KeyRound },
    { name: 'Activity History', path: '/audit', icon: ShieldCheck },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#FCFDFE]/95 backdrop-blur-xl border-r border-slate-200/80 z-40 flex flex-col justify-between select-none">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Brand */}
        <div className="p-4 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-100/80 transition-all group">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-slate-900/10 shadow-sm flex items-center justify-center bg-brand-600 flex-shrink-0">
              <img
                src="/logo.svg"
                alt="Laxmi Niwas Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight truncate">Laxmi Niwas</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
              </div>
              <span className="text-[11px] text-slate-500 truncate font-medium">Verification Portal</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5 flex-1">
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Verification Services
            </div>
            <nav className="space-y-0.5">
              {mainNav.map(item => {
                const Icon = item.icon;
                const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-bold shadow-2xs ring-1 ring-brand-600/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span className="flex-1 truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Tools & Access
            </div>
            <nav className="space-y-0.5">
              {adminNav.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-bold ring-1 ring-brand-600/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span className="flex-1 truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-100 bg-white/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-slate-200 flex-shrink-0 bg-slate-200">
                <img
                  src="/executive_avatar.jpg"
                  alt="Shubham Agrawal"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://ui-avatars.com/api/?name=Shubham+Agrawal&background=059669&color=fff';
                  }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">Shubham Agrawal</span>
                <span className="text-[10px] text-slate-500 truncate">Administrator</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Online
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
