import React, { useState, useEffect, useRef } from 'react';
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
  Shield,
  Check,
  Zap,
  Activity,
  CreditCard,
  Fingerprint,
  Landmark,
  FileCheck,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { soundEngine } from '../utils/soundEffects.js';
import { ALL_APIS } from '../config/constants.js';

// Live showcase features cycling in the hero section
const SHOWCASE_SERVICES = [
  {
    id: 'pan',
    title: 'PAN 2.0 Realtime OCR',
    subtitle: 'NSDL & Income Tax Dept Rail',
    icon: CreditCard,
    badge: 'Direct Node',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    stat: '< 340ms Latency',
    statColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    description: 'Instant entity name matching, live active status verification, Aadhaar linkage audit & fraud mitigation.'
  },
  {
    id: 'aadhaar',
    title: 'Aadhaar DigiLocker 2.0',
    subtitle: 'UIDAI Statutory Framework',
    icon: Fingerprint,
    badge: 'OTP & Biometric',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    stat: '99.99% Precision',
    statColor: 'text-blue-700 bg-blue-50 border-blue-200',
    description: 'Cryptographically signed XML extraction, automated face match, and statutory address resolution.'
  },
  {
    id: 'bank',
    title: 'Direct Bank Penny-Drop',
    subtitle: 'NPCI IMPS Fast Rail',
    icon: Landmark,
    badge: 'Live Reverse IMPS',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    stat: '99.98% Success',
    statColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    description: 'Instant account beneficiary resolution, IFSC validation, and automated micro-penny reconciliation.'
  },
  {
    id: 'bureau',
    title: 'Tri-Bureau Credit Engine',
    subtitle: 'CIBIL • Experian • CRIF',
    icon: FileCheck,
    badge: 'Level 5 Access',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    stat: '360° Risk Score',
    statColor: 'text-amber-800 bg-amber-50 border-amber-200',
    description: 'Real-time CCR report pull, default probability scoring, repayment telemetry, and PDF parsing.'
  }
];

// Interactive background grid with dynamic light particles
function LightAmbientCyberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for crisp light theme
    const particleCount = Math.min(Math.floor((width * height) / 24000), 50);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.3 + 0.15,
      pulse: Math.random() * Math.PI,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle light blueprint grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.08;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${Math.max(0.12, currentAlpha)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(37, 99, 235, 0.25)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw node connections
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 110) * 0.14})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connection to mouse pointer
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(5, 150, 105, ${(1 - mdist / 130) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}

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
  const [soundActive, setSoundActive] = useState(soundEngine.isEnabled());

  // Showcase state
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

  // Loading & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingPhase, setSubmittingPhase] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeError, setShakeError] = useState(false);

  // Auto-cycle showcase items
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcaseIdx((prev) => (prev + 1) % SHOWCASE_SERVICES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Keyboard CapsLock Listener
  const handleKeyDown = (e) => {
    soundEngine.playKey();
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  // Toggle sound effects
  const handleToggleSound = () => {
    const state = soundEngine.toggleSound();
    setSoundActive(state);
  };


  // Submit Authentication
  const handleAuthenticate = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      soundEngine.playError();
      setErrorMessage('Please enter both your identifier and security key.');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setSubmittingPhase('Verifying encrypted session...');
    soundEngine.playBiometricScan();

    try {
      // Step phase for crisp feedback
      await new Promise((r) => setTimeout(r, 450));
      setSubmittingPhase('Authenticating Master Clearance...');

      const res = await login({
        email: trimmedEmail,
        password: trimmedPass
      });

      if (res && res.success) {
        setSubmittingPhase('Clearance Granted! Launching...');
        soundEngine.playSuccess();

        // Celebration Confetti
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2563EB', '#059669', '#4F46E5', '#D97706']
        });

        toast?.addToast?.({
          title: 'Authentication Authorized',
          message: `Welcome back, ${res.user.name || 'Administrator'}!`,
          type: 'success'
        });

        setTimeout(() => {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (err) {
      soundEngine.playError();
      setIsSubmitting(false);
      setSubmittingPhase('');
      setErrorMessage(err.message || 'Invalid credentials. Please verify your access key.');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  };

  const activeShowcase = SHOWCASE_SERVICES[activeShowcaseIdx];
  const ShowcaseIcon = activeShowcase.icon;

  return (
    <div className="relative min-h-screen w-full bg-[#F4F7FB] text-slate-900 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-brand-500/20 selection:text-brand-900">
      {/* Light Ambient Cyber Canvas */}
      <LightAmbientCyberCanvas />

      {/* Radiant Light Ambient Backdrop Orbs */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[450px] bg-blue-100/70 blur-[130px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[450px] bg-emerald-100/60 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[550px] h-[550px] bg-indigo-100/50 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Top Light Navbar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => soundEngine.playClick()}>
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 p-[1.5px] shadow-sm shadow-emerald-600/20 group-hover:shadow-emerald-600/35 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5 shadow-inner">
                <img
                  src="/logo.svg"
                  alt="Laxmi Niwas"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {/* Live active dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-[0_0_6px_#10B981]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                Laxmi Niwas
              </span>
              <span className="px-1.5 py-0.5 text-[9.5px] font-mono font-bold tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase shadow-2xs">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide block mt-1">
              Enterprise Verification Platform
            </span>
          </div>
        </div>

        {/* Right Status Badges & Sound Toggle */}
        <div className="flex items-center gap-3">
          {/* Live Node Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-xs text-slate-700 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11.5px] font-semibold text-slate-800">
              {ALL_APIS.length} APIs Live
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10.5px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70">
              99.98% SLA
            </span>
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundActive ? 'Mute Interface Audio' : 'Unmute Interface Audio'}
            className="p-2.5 rounded-xl bg-white/90 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all backdrop-blur-md active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
          >
            {soundActive ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Hero & Feature Showcase Column */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7">
          
          {/* Institutional Compliance Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-xs backdrop-blur-md self-start"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold tracking-tight text-slate-800">
              ISO 27001 &amp; SOC-2 Type II Certified Gateway
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-900 leading-[1.18]">
              Instant Identity, KYC &amp;{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                Financial Risk Intelligence
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              High-throughput statutory verification stack for PAN 2.0 OCR, Biometric Aadhaar DigiLocker, IMPS Penny Drop, and Tri-Bureau Credit intelligence.
            </p>
          </motion.div>

          {/* Dynamic Showcase Card (Light Edition) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl bg-white/95 border border-slate-200/90 p-5 sm:p-6 backdrop-blur-xl shadow-lg shadow-slate-200/50 overflow-hidden group"
          >
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500" />

            {/* Showcase Header */}
            <div className="flex items-start justify-between mb-4 mt-1">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs border ${activeShowcase.iconBg}`}>
                  <ShowcaseIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {activeShowcase.title}
                    </h3>
                    <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md border ${activeShowcase.badgeColor}`}>
                      {activeShowcase.badge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeShowcase.subtitle}
                  </span>
                </div>
              </div>

              <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${activeShowcase.statColor}`}>
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                {activeShowcase.stat}
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed mb-4">
              {activeShowcase.description}
            </p>

            {/* Showcase Nav Dots */}
            <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                {SHOWCASE_SERVICES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveShowcaseIdx(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === activeShowcaseIdx
                      ? 'w-6 bg-blue-600 shadow-xs'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-500">
                Engine 0{activeShowcaseIdx + 1} of 0{SHOWCASE_SERVICES.length}
              </span>
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-3 pt-1 text-center"
          >
            <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-sm">
              <div className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">1.48M+</div>
              <div className="text-[10.5px] text-slate-500 font-semibold mt-0.5">Daily Queries</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-sm">
              <div className="text-base sm:text-lg font-extrabold text-emerald-600 font-mono">99.98%</div>
              <div className="text-[10.5px] text-slate-500 font-semibold mt-0.5">Node Uptime SLA</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-sm">
              <div className="text-base sm:text-lg font-extrabold text-blue-600 font-mono">&lt; 420ms</div>
              <div className="text-[10.5px] text-slate-500 font-semibold mt-0.5">Avg Response Time</div>
            </div>
          </motion.div>

        </div>

        {/* Right Authentication Card Column */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`w-full max-w-[450px] rounded-3xl bg-white/95 border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/70 backdrop-blur-2xl relative overflow-hidden ${shakeError ? 'animate-shake' : ''
              }`}
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500" />


            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Enterprise Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Enter your administrative key to access the statutory verification cockpit.
              </p>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="flex-1 leading-snug font-medium">{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleAuthenticate} className="space-y-4">
              
              {/* Email / Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'
                      }`}
                  />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={email}
                    onFocus={() => {
                      setFocusedField('email');
                      soundEngine.playKey();
                    }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    placeholder="admin@laxminiwas.in or admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Password / Security Key
                  </label>
                  {capsLockActive && (
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 animate-pulse">
                      <span>⚠️ CAPS LOCK ON</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'
                      }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onFocus={() => {
                      setFocusedField('password');
                      soundEngine.playKey();
                    }}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Hardware Token State */}
              <div className="flex items-center justify-between py-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => {
                      soundEngine.playClick();
                      setRememberMe(e.target.checked);
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                      }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-slate-600 font-medium text-[11.5px]">
                    Remember this terminal
                  </span>
                </label>

                <span className="text-[11px] text-slate-500 font-mono">
                  Clearance: <strong className="text-slate-700 font-semibold">L5 Admin</strong>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 active:scale-[0.99] transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group"
              >
                {/* Subtle shine animation effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{submittingPhase || 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Verification Portal</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Security Guarantee & Clearance Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-[10.5px] text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  256-bit HSM Encrypted
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  UIDAI / NSDL Compliant
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Statutory verification portal for authorized personnel.
              </p>
            </div>
          </motion.div>
        </div>

      </main>

      {/* Institutional Light Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Laxmi Niwas Technology Group. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Security Protocol v4.2</span>
          <span>•</span>
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Statutory SLA</span>
          <span>•</span>
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Node Telemetry</span>
        </div>
      </footer>
    </div>
  );
}
