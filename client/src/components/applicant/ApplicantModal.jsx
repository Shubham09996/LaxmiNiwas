import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, RotateCcw, Check, Shield } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { soundEngine } from '../../utils/soundEffects.js';

export const DEFAULT_MASTER_PROFILE = {
  fullName: 'SHUBHAM GUPTA',
  mobileNumber: '9876543210',
  panNumber: 'AAACL7821M',
  aadhaarNumber: '984512348921',
  email: 'careers@infosys.com'
};

export default function ApplicantModal({ isOpen, onClose, currentProfile, onSave }) {
  const [profile, setProfile] = useState(currentProfile || DEFAULT_MASTER_PROFILE);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setProfile(currentProfile || DEFAULT_MASTER_PROFILE);
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundEngine.playSuccess();
    onSave(profile);
    addToast({
      title: 'Applicant Details Updated',
      message: 'Active profile synchronized across all verification services.',
      type: 'success'
    });
    onClose();
  };

  const handleResetDefaults = () => {
    soundEngine.playClick();
    setProfile(DEFAULT_MASTER_PROFILE);
    onSave(DEFAULT_MASTER_PROFILE);
    addToast({
      title: 'Restored Defaults',
      message: 'Applicant profile reset to standard credentials.',
      type: 'info'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="bg-white border border-slate-200/90 rounded-2xl shadow-elevated max-w-lg w-full p-6 space-y-5"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-base">
                Active Candidate Profile
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Set credentials referenced by verification services.
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => {
                soundEngine.playKey();
                setProfile(prev => ({ ...prev, fullName: e.target.value.toUpperCase() }));
              }}
              placeholder="e.g. SHUBHAM GUPTA"
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered Mobile Number
              </label>
              <input
                type="text"
                maxLength={10}
                required
                value={profile.mobileNumber}
                onChange={(e) => {
                  soundEngine.playKey();
                  setProfile(prev => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, '') }));
                }}
                placeholder="10 digit number"
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PAN Card Number
              </label>
              <input
                type="text"
                maxLength={10}
                required
                value={profile.panNumber}
                onChange={(e) => {
                  soundEngine.playKey();
                  setProfile(prev => ({ ...prev, panNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }));
                }}
                placeholder="10 char alphanumeric"
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Aadhaar Number (12 Digits)
            </label>
            <input
              type="text"
              maxLength={12}
              required
              value={profile.aadhaarNumber}
              onChange={(e) => {
                soundEngine.playKey();
                setProfile(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '') }));
              }}
              placeholder="12 digit number"
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-600">
            <Shield className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <span>
              Credentials persist across your session and dynamically pre-fill verification forms.
            </span>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </motion.button>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </motion.button>
            </div>
          </div>
        </form>

      </motion.div>
    </div>
  );
}
