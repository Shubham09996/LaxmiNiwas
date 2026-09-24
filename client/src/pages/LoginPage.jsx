import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { soundEngine } from '../utils/soundEffects.js';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Loading & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeError, setShakeError] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Keyboard CapsLock Listener
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  // Submit Authentication
  const handleAuthenticate = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      soundEngine.playError();
      setErrorMessage('Please enter both your email/username and password.');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    soundEngine.playClick();

    try {
      const res = await login({
        email: trimmedEmail,
        password: trimmedPass
      });

      if (res && res.success) {
        soundEngine.playSuccess();
        toast?.addToast?.({
          title: 'Authentication Successful',
          message: `Welcome back, ${res.user.name}!`,
          type: 'success'
        });

        setTimeout(() => {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 400);
      }
    } catch (err) {
      soundEngine.playError();
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Invalid credentials. Please verify and try again.');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col justify-between items-center p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl ring-1 ring-slate-200 bg-brand-600 flex items-center justify-center p-2 flex-shrink-0">
            <img
              src="/logo.svg"
              alt="Laxmi Niwas"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base tracking-tight block leading-tight">
              Laxmi Niwas
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Enterprise Verification Platform
            </span>
          </div>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="w-full max-w-[420px] my-auto py-8">
        <div
          className={`w-full rounded-2xl bg-white border border-slate-200/90 p-7 sm:p-8 shadow-card ${
            shakeError ? 'animate-shake' : ''
          }`}
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Access your enterprise verification workspace.
            </p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="flex-1 leading-snug">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleAuthenticate} className="space-y-4">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    focusedField === 'email' ? 'text-brand-600' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  placeholder="Enter email or username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                {capsLockActive && (
                  <span className="text-[10px] font-semibold text-amber-600">
                    CAPS LOCK IS ON
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    focusedField === 'password' ? 'text-brand-600' : 'text-slate-400'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    rememberMe
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-xs text-slate-600 font-medium">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Verification Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Statutory verification portal for authorized personnel.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 font-medium">
        <span>© {new Date().getFullYear()} Laxmi Niwas. All rights reserved.</span>
      </footer>
    </div>
  );
}
