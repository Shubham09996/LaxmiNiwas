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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { soundEngine } from '../../utils/soundEffects.js';

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
        
        {/* Left: Mobile Toggle & Brand Context */}
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onMobileMenuToggle();
            }}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-2 text-xs min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight whitespace-nowrap">Laxmi Niwas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span className="text-slate-300 hidden xl:inline">/</span>
            <span className="text-slate-500 font-medium hidden xl:inline whitespace-nowrap">Enterprise Verification Suite</span>
          </div>
        </div>

        {/* Right: Controls, Applicant Capsule & User Account */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 min-w-0">
          
          {/* Sound Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-colors flex-shrink-0 cursor-pointer ${
              soundOn
                ? 'bg-slate-50 border-slate-200 text-brand-600 hover:bg-slate-100'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={soundOn ? 'Interactive Audio Feedback: Enabled' : 'Interactive Audio Feedback: Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* User Account Popover */}
          {isAuthenticated && user ? (
            <div className="relative flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setProfileOpen(!profileOpen);
                }}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors border border-transparent hover:border-slate-200/70"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-slate-200 bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-xs">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0F172A&color=fff`;
                      }}
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-navy-900" />
                  )}
                </div>

                <span className="hidden sm:inline font-bold text-slate-800 truncate max-w-[110px]">
                  {user.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-elevated p-2 z-20 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {user.role && (
                          <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {user.role}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              Sign In
            </NavLink>
          )}

        </div>

      </div>
    </header>
  );
}
