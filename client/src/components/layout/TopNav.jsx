import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Zap,
  LogOut,
  ShieldCheck,
  User,
  ChevronDown,
  Layers,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { soundEngine } from '../../utils/soundEffects.js';
import { ALL_APIS, TOTAL_COST_WITH_GST } from '../../config/constants.js';

export default function TopNav() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    soundEngine.playClick();
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070B18]/80 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/logo.svg"
              alt="Laxmi Niwas Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight group-hover:text-indigo-400 transition-colors">
                Laxmi Niwas
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Live Statutory Verification Gateway
            </span>
          </div>
        </NavLink>

        {/* Center Live Gateway Status Info */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800/90 shadow-inner text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Gateways Live & Connected</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-indigo-300 font-bold font-mono">
            {ALL_APIS.length} APIs (Bharat Cloud Live Engine)
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-extrabold font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            ₹ {TOTAL_COST_WITH_GST.toFixed(2)}
          </span>
        </div>

        {/* Right Section: User Profile Pill / Logout */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-indigo-500/50 flex-shrink-0 bg-indigo-950 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=Shubham+Agrawal&background=4f46e5&color=fff';
                      }}
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {user.name}
                    </span>
                    <span className="text-[10px]">👑</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-glow-indigo"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
