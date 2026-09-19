import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Check,
  Sparkles
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
  const [email, setEmail] = useState('admin@laxminiwas.in');
  const [password, setPassword] = useState('admin123');
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

        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6']
        });

        toast?.showToast?.(`Welcome back, ${res.user.name}!`, 'success');

        setTimeout(() => {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 500);
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
    <div className="h-screen max-h-screen w-full bg-[#050814] text-slate-100 flex flex-col justify-between items-center overflow-hidden font-sans selection:bg-indigo-500 selection:text-white select-none relative">
      {/* Dynamic Animated Ambient Glow Lights */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-15%] right-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] left-[-10%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Subtle Background Radial Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      ></div>

      {/* Top Brand Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-indigo-600 to-purple-600 p-[1.5px] shadow-[0_0_20px_rgba(99,102,241,0.35)] flex-shrink-0">
            <div className="w-full h-full bg-[#080D1D] rounded-2xl flex items-center justify-center p-2">
              <img
                src="/logo.svg"
                alt="Laxmi Niwas"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">
                Laxmi Niwas
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Enterprise Verification Gateway
            </span>
          </div>
        </div>
      </header>

      {/* Centered Login Masterpiece Card */}
      <main className="w-full max-w-[430px] px-4 my-auto relative z-10 flex flex-col items-center">
        {/* Glow halo behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 rounded-[32px] blur-xl opacity-70 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`w-full rounded-3xl bg-[#0A0F24]/90 backdrop-blur-3xl border border-white/[0.1] p-7 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(99,102,241,0.25)] relative ${
            shakeError ? 'animate-shake' : ''
          }`}
        >
          {/* Top Iridescent Glow Accent */}
          <div className="absolute -top-[1px] left-14 right-14 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          <div className="absolute -bottom-[1px] left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

          {/* Card Header & Shield */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] mb-3">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>

            <h1 className="text-2xl sm:text-[25px] font-black tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed font-medium">
              Sign in to your enterprise verification workspace.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="flex-1 leading-tight">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleAuthenticate} className="space-y-4">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Enterprise Identifier</span>
              </label>
              <div
                className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'email'
                    ? 'ring-2 ring-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : ''
                }`}
              >
                <Mail
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    focusedField === 'email' ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                />
                <input
                  type="text"
                  required
                  value={email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  placeholder="name@laxminiwas.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Security Passkey
                </label>
                {capsLockActive && (
                  <span className="text-[10px] font-bold text-amber-400 animate-pulse">
                    CAPS LOCK IS ON
                  </span>
                )}
              </div>
              <div
                className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'password'
                    ? 'ring-2 ring-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : ''
                }`}
              >
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    focusedField === 'password' ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Only (Strictly No Forgot Password & No Register) */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    rememberMe
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow-indigo'
                      : 'border-slate-700 bg-slate-900 group-hover:border-slate-600'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 font-medium transition-colors">
                  Remember this device
                </span>
              </label>

              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Secure</span>
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-wide">SIGN IN TO GATEWAY</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </button>
          </form>

          {/* Bottom Security Note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Statutory verification portal for authorized enterprise personnel.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-xs text-slate-500 relative z-10 flex-shrink-0 font-medium">
        <span>© {new Date().getFullYear()} Laxmi Niwas. All rights reserved.</span>
      </footer>
    </div>
  );
}
