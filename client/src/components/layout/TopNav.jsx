import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Activity,
  Shield,
  Clock,
  Building2,
  Lock,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { soundEngine } from '../../utils/soundEffects.js';
import { ALL_APIS } from '../../config/constants.js';

export default function TopNav({
  masterProfile,
  onOpenApplicantModal,
  onMobileMenuToggle
}) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => soundEngine.isEnabled());

  const handleToggleSound = () => {
    const newState = soundEngine.toggleSound();
    setSoundOn(newState);
  };

  const handleLogout = async () => {
    soundEngine.playClick();
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center px-4 sm:px-6 shadow-2xs select-none w-full max-w-full min-w-0">
      <div className="w-full flex items-center justify-between gap-3 min-w-0">

        {/* Left: Mobile Menu & Platform Identifier */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onMobileMenuToggle();
            }}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-2 text-xs min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight whitespace-nowrap">
                Laxmi Niwas
              </span>
              <span className="px-1.5 py-0.5 text-[9.5px] font-mono font-bold tracking-wider rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase shadow-2xs">
                PRO
              </span>
            </div>
            <span className="text-slate-300 hidden md:inline">/</span>
            <span className="text-slate-500 font-semibold hidden md:inline whitespace-nowrap">
              Verification Command Hub
            </span>
          </div>
        </div>

        {/* Center: Live Gateways Telemetry Capsule (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50/90 border border-slate-200/80 text-xs shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11.5px] font-bold text-slate-800">
            {ALL_APIS.length} APIs Live
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[10.5px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
            99.98% SLA
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[10.5px] text-slate-500 font-medium">
            &lt; 420ms Avg Latency
          </span>
        </div>

        {/* Right: Sound Toggle, Status & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">

          {/* Sound Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all flex-shrink-0 cursor-pointer shadow-2xs ${soundOn
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-600 hover:bg-emerald-100/80'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            title={soundOn ? 'Interactive Audio: Enabled' : 'Interactive Audio: Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </motion.button>

          {/* User Account Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setProfileOpen(!profileOpen);
                }}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100/90 text-xs font-semibold text-slate-700 transition-all border border-slate-200/80 hover:border-slate-300 shadow-2xs cursor-pointer bg-white"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-blue-500/30 bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Admin')}&background=2563EB&color=fff`;
                      }}
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-white" />
                  )}
                </div>

                <div className="text-left hidden sm:block leading-tight">
                  <span className="font-extrabold text-slate-900 text-xs truncate max-w-[120px] block">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    L5 Admin
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-3 z-20 text-xs"
                    >
                      {/* Popover Header with User Details */}
                      <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl border border-slate-100 mb-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold text-slate-900 text-[13px] truncate">{user.name}</p>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                        
                        <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10.5px]">
                          <span className="text-slate-500 font-medium">Clearance:</span>
                          <span className="font-bold text-blue-700">LEVEL 5 MASTER</span>
                        </div>
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="text-slate-500 font-medium">Department:</span>
                          <span className="font-semibold text-slate-700">Risk &amp; Compliance</span>
                        </div>
                      </div>

                      {/* Sign Out Button */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-bold text-xs cursor-pointer border border-transparent hover:border-red-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Terminal</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Sign In
            </NavLink>
          )}

        </div>

      </div>
    </header>
  );
}
