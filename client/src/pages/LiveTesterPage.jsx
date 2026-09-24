import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Play,
  AlertCircle,
  Edit2,
  CheckCircle2,
  Clock,
  Shield,
  ShieldCheck,
  CreditCard,
  Fingerprint,
  Briefcase,
  FileCheck,
  Landmark,
  ArrowRightLeft,
  Smartphone,
  Globe,
  MapPin,
  TrendingUp,
  ArrowRight,
  User,
  Check,
  Building,
  FileText,
  Lock,
  Layers,
  Copy,
  Sparkles,
  Zap,
  CheckCheck,
  Radio,
  ExternalLink,
  ShieldAlert,
  Search,
  X
} from 'lucide-react';
import { ALL_APIS } from '../config/constants.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { soundEngine } from '../utils/soundEffects.js';
import Visual3DCard from '../components/3d/Visual3DCard.jsx';
import { DEFAULT_MASTER_PROFILE } from '../components/applicant/ApplicantModal.jsx';

function getDerivedPlaceholder(apiItem, key, master) {
  if (!apiItem || !apiItem.sampleInput) return '';
  const defaultVal = apiItem.sampleInput[key] || '';
  const lower = key.toLowerCase();
  const nameParts = (master.fullName || '').trim().split(/\s+/);
  const firstName = nameParts[0] || 'SHUBHAM';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'GUPTA';

  if (lower === 'name' || lower === 'fullname' || lower === 'registered_name') {
    return master.fullName || defaultVal;
  }
  if (lower === 'first_name' || lower === 'forename' || lower === 'firstname') {
    return firstName;
  }
  if (lower === 'last_name' || lower === 'surname' || lower === 'lastname') {
    return lastName;
  }
  if (lower.includes('pan')) {
    return master.panNumber || defaultVal;
  }
  if (lower.includes('aadhaar')) {
    return master.aadhaarNumber || defaultVal;
  }
  if (lower.includes('mobile') || lower.includes('phone')) {
    return master.mobileNumber || defaultVal;
  }
  return defaultVal;
}

function getHumanFieldLabel(key) {
  const map = {
    pan: 'PAN Card Number',
    pan_id: 'PAN Card Number',
    pan_number: 'PAN Card Number',
    name: 'Applicant Full Legal Name',
    fullname: 'Applicant Full Legal Name',
    first_name: 'First Name',
    forename: 'First Name',
    last_name: 'Last Name',
    surname: 'Surname / Last Name',
    aadhaar_number: 'Aadhaar Number (12 Digits)',
    client_id: 'DigiLocker Client Request ID',
    account_number: 'Bank Account Number',
    ifsc: 'Bank IFSC Code',
    mobile: 'Registered Mobile Number',
    mobile_number: 'Registered Mobile Number',
    mobile_no: 'Registered Mobile Number',
    phone_number: 'Registered Mobile Number',
    uan: 'Universal Account Number (UAN)',
    ip: 'IP Address to Evaluate',
    lat: 'GPS Latitude',
    lon: 'GPS Longitude',
    domain: 'Corporate Domain Name',
    gender: 'Gender',
    date_of_birth: 'Date of Birth (YYYY-MM-DD)',
    dob: 'Date of Birth (YYYY-MM-DD)',
    redirectUrl: 'DigiLocker Redirect Callback URL',
    logoUrl: 'Company Logo URL'
  };
  return map[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getCtaButtonLabel(apiId, defaultName) {
  const map = {
    'pan-advance': 'Execute PAN Plus Verification',
    'aadhaar-fetch-without-otp': 'Fetch Aadhaar Details (Without OTP)',
    'aadhaar-digilocker-generate': 'Generate DigiLocker Consent URL',
    'aadhaar-digilocker-fetch': 'Fetch Verified Aadhaar e-KYC',
    'bank-account-verification': 'Verify Bank Beneficiary',
    'bank-ifsc-lookup': 'Lookup Bank IFSC Details',
    'mobile-to-bank-advance': 'Lookup Linked Bank Accounts (Advance)',
    'mobile-upi-lookup-enhanced': 'Lookup Linked UPI / VPA Handle',
    'uan-lookup-mobile': 'Search Linked UAN Records',
    'uan-direct-history': 'Fetch UAN Service Record',
    'mobile-profile-prefill': 'Fetch Telecom Demographic Data',
    'ip-fraud-geolocation': 'Evaluate IP Fraud Risk',
    'reverse-geocoding': 'Reverse Geocode Location',
    'domain-age-security': 'Validate Domain & MX Security',
    'cibil-transunion-pdf': 'Generate Official TransUnion CIBIL CIR',
    'experian-credit-report': 'Fetch Experian Credit Dossier',
    'crif-credit-score-v4': 'Generate CRIF HighMark Credit Report'
  };
  return map[apiId] || `Verify ${defaultName}`;
}

function getCategoryTheme(category) {
  switch (category?.toUpperCase()) {
    case 'BANKING':
      return {
        cardBg: 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 border-blue-200/80',
        badge: 'text-blue-700 bg-blue-100/70 border-blue-300/80 font-bold',
        iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30',
        accentGlow: 'from-blue-500/15 to-transparent',
        tagBg: 'bg-blue-50 text-blue-700 border-blue-200/60'
      };
    case 'IDENTITY':
      return {
        cardBg: 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200/80',
        badge: 'text-emerald-700 bg-emerald-100/70 border-emerald-300/80 font-bold',
        iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30',
        accentGlow: 'from-emerald-500/15 to-transparent',
        tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
      };
    case 'BUREAU':
      return {
        cardBg: 'bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 border-indigo-200/80',
        badge: 'text-indigo-700 bg-indigo-100/70 border-indigo-300/80 font-bold',
        iconBg: 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30',
        accentGlow: 'from-indigo-500/15 to-transparent',
        tagBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
      };
    case 'EMPLOYMENT':
      return {
        cardBg: 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-amber-200/80',
        badge: 'text-amber-700 bg-amber-100/70 border-amber-300/80 font-bold',
        iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30',
        accentGlow: 'from-amber-500/15 to-transparent',
        tagBg: 'bg-amber-50 text-amber-700 border-amber-200/60'
      };
    case 'SECURITY':
    case 'RISK':
      return {
        cardBg: 'bg-gradient-to-br from-violet-50/80 via-white to-pink-50/40 border-violet-200/80',
        badge: 'text-violet-700 bg-violet-100/70 border-violet-300/80 font-bold',
        iconBg: 'bg-gradient-to-tr from-violet-600 to-pink-600 text-white shadow-md shadow-violet-500/30',
        accentGlow: 'from-violet-500/15 to-transparent',
        tagBg: 'bg-violet-50 text-violet-700 border-violet-200/60'
      };
    default:
      return {
        cardBg: 'bg-gradient-to-br from-blue-50/80 via-white to-slate-50/40 border-blue-200/80',
        badge: 'text-blue-700 bg-blue-100/70 border-blue-300/80 font-bold',
        iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30',
        accentGlow: 'from-blue-500/15 to-transparent',
        tagBg: 'bg-blue-50 text-blue-700 border-blue-200/60'
      };
  }
}

const iconMap = {
  CreditCard,
  Fingerprint,
  Briefcase,
  FileCheck,
  Landmark,
  ArrowRightLeft,
  Smartphone,
  Globe,
  MapPin,
  Shield,
  TrendingUp
};

export default function LiveTesterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlApiId = searchParams.get('api') || 'pan-advance';

  // Master candidate profile persisted in localStorage
  const [masterProfile, setMasterProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('lxn_master_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_MASTER_PROFILE;
    } catch {
      return DEFAULT_MASTER_PROFILE;
    }
  });

  // Form execution states
  const [inputParams, setInputParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const { addToast } = useToast();

  // Active API item
  const selectedApi = useMemo(() => {
    return ALL_APIS.find(a => a.id === urlApiId) || ALL_APIS[0];
  }, [urlApiId]);

  const ActiveIcon = iconMap[selectedApi.icon] || CreditCard;
  const theme = getCategoryTheme(selectedApi.category);

  // Sync masterProfile across tabs/windows
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('lxn_master_profile_v1');
        if (saved) setMasterProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Reset inputs when switching selected service
  useEffect(() => {
    if (selectedApi) {
      setInputParams({});
      setResult(null);
      setError('');
    }
  }, [selectedApi?.id]);

  const handleSaveMasterProfile = (newProfile) => {
    setMasterProfile(newProfile);
    try {
      localStorage.setItem('lxn_master_profile_v1', JSON.stringify(newProfile));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (key, val) => {
    soundEngine.playKey();
    setInputParams(prev => ({ ...prev, [key]: val }));
  };

  const handleSelectRelated = (apiId) => {
    soundEngine.playClick();
    setSearchParams({ api: apiId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExecute = async (e) => {
    e?.preventDefault();
    if (!selectedApi) return;

    setError('');
    setLoading(true);
    soundEngine.playBiometricScan();

    try {
      const payloadToSend = {};
      Object.keys(selectedApi.sampleInput || {}).forEach(k => {
        const userVal = inputParams[k];
        const placeholderVal = getDerivedPlaceholder(selectedApi, k, masterProfile);
        payloadToSend[k] = (userVal !== undefined && userVal !== null && String(userVal).trim() !== '')
          ? String(userVal).trim()
          : placeholderVal;
      });

      const res = await api.testApi(selectedApi.id, {
        ...payloadToSend,
        masterProfile
      });

      setResult(res);

      if (res.success) {
        soundEngine.playSuccess();
        try {
          confetti({
            particleCount: 45,
            spread: 65,
            origin: { y: 0.75 },
            colors: ['#2563EB', '#10B981', '#38BDF8']
          });
        } catch (e) {}

        addToast({
          title: 'Verification Complete',
          message: `${res.apiName} verified successfully.`,
          type: 'success'
        });
      } else {
        soundEngine.playError();
        setError(res.error || 'Verification request returned an upstream notice.');
        addToast({
          title: 'Verification Notice',
          message: res.error || 'Upstream response alert',
          type: 'warning'
        });
      }
    } catch (err) {
      soundEngine.playError();
      setError(err.message || 'Failed to complete verification.');
      addToast({
        title: 'Communication Error',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 w-full animate-in fade-in duration-150">
      
      {/* =========================================================================
         TOP COMMAND BAR: Hero Identity + Related Services Switcher
         ========================================================================= */}
      <div className={`rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden border ${theme.cardBg}`}>
        
        {/* Ambient Gradient Glow */}
        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br ${theme.accentGlow} blur-2xl pointer-events-none`} />

        {/* Top Service Identity Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 relative z-10">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.iconBg}`}>
              <ActiveIcon className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider border shadow-2xs ${theme.badge}`}>
                  {selectedApi.category}
                </span>
                {selectedApi.tag && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.tagBg}`}>
                    {selectedApi.tag}
                  </span>
                )}
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Instant Verification</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
                {selectedApi.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mt-0.5">
                {selectedApi.description}
              </p>
            </div>
          </div>

          {/* Standard Fee Indicator */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between bg-white/95 backdrop-blur-xs border border-slate-200/80 p-3 lg:px-4 lg:py-2.5 rounded-xl flex-shrink-0 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Standard Service Fee
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg sm:text-2xl font-extrabold text-slate-900 font-mono">
                ₹ {selectedApi.cost.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">/ query</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Related Services Switcher */}
        {ALL_APIS.filter(a => a.id !== selectedApi.id && a.category === selectedApi.category).length > 0 && (
          <div className="pt-3.5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs flex-wrap relative z-10">
            <span className="text-slate-500 text-[11px] font-bold whitespace-nowrap">Related Services:</span>
            {ALL_APIS.filter(a => a.id !== selectedApi.id && a.category === selectedApi.category).slice(0, 4).map(rel => (
              <button
                key={rel.id}
                type="button"
                onClick={() => handleSelectRelated(rel.id)}
                className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-semibold text-[11px] whitespace-nowrap transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                {rel.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* =========================================================================
         DUAL-PANE COMMAND CONSOLE (Left: Form Controller | Right: Live Certified Dossier)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start w-full min-w-0">
        
        {/* =======================================================================
           LEFT COLUMN: Verification Controller & Interactive Inputs (5 of 12 cols)
           ======================================================================= */}
        <div className="lg:col-span-5 space-y-4 w-full min-w-0">
          
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Top Accent Gradient Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400" />
            
            <div className="p-5 sm:p-6 space-y-5">
              
              {/* Form Header */}
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verification Parameters
                </h2>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Enter required attributes to execute live statutory verification.
                </p>
              </div>

            {/* Form Fields */}
            <form onSubmit={handleExecute} className="space-y-4">
              {Object.keys(selectedApi.sampleInput || {}).map((k) => {
                const userVal = inputParams[k] ?? '';
                const label = getHumanFieldLabel(k);

                return (
                  <div key={k} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        {label}
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={userVal}
                        onChange={(e) => handleInputChange(k, e.target.value)}
                        placeholder={`Enter ${label}...`}
                        className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-mono shadow-2xs"
                      />
                      {userVal && (
                        <button
                          type="button"
                          onClick={() => handleInputChange(k, '')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                          title="Clear field"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Execution Action Button */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-[0.985] text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying with Upstream Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>{getCtaButtonLabel(selectedApi.id, selectedApi.name)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            </div>
          </div>

          {/* Quick Security Assurance Card */}
          <div className="p-4 bg-emerald-50/40 border border-emerald-200/60 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="leading-tight">
              <span className="font-bold text-slate-900 block">End-to-End Cryptographic Security</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                All requests signed with 256-bit TLS encryption against central authorities.
              </span>
            </div>
          </div>

        </div>

        {/* =======================================================================
           RIGHT COLUMN: Live Certified Dossier Canvas (7 of 12 cols)
           ======================================================================= */}
        <div className="lg:col-span-7 w-full min-w-0">
          
          <AnimatePresence mode="wait">
            
            {/* State 1: Active Loading Progress Radar */}
            {loading ? (
              <motion.div
                key="state-loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-6"
              >
                {/* Cryptographic Radar Animation */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin"></div>
                  <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                    <ActiveIcon className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="font-bold text-navy-900 text-base">
                    Executing Real-Time Verification
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Connecting to {selectedApi.tag || 'Central Authority Database'} and validating digital record signatures.
                  </p>
                </div>

                {/* Progressive Verification Steps */}
                <div className="max-w-xs mx-auto space-y-2 text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Payload Sanitized & Signed</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-700 font-semibold">
                    <div className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    <span>Querying Upstream Authority...</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Clock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span>Formatting Certified Report</span>
                  </div>
                </div>
              </motion.div>
            ) : result ? (
              /* State 2: Real Verification Dossier Output */
              <motion.div
                key="state-result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Certified Verification Dossier</span>
                  <span className="text-emerald-700 font-bold font-mono">● LIVE RECORD VERIFIED</span>
                </div>
                <Visual3DCard result={result} />
              </motion.div>
            ) : (
              /* State 3: Interactive Idle Security Blueprint Preview */
              <motion.div
                key="state-idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gradient-to-b from-white via-blue-50/20 to-indigo-50/30 border border-blue-200/70 rounded-2xl p-7 sm:p-9 shadow-xs space-y-6 text-center relative overflow-hidden"
              >
                {/* Subtle radiant background aura */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/25 relative z-10">
                  <Shield className="w-7 h-7" />
                </div>

                <div className="space-y-1 max-w-md mx-auto relative z-10">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Verification Blueprint Active
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Select a preset or complete the parameters on the left to execute live statutory verification and generate certified records.
                  </p>
                </div>

                {/* Verification Scope Checklist */}
                <div className="max-w-md mx-auto p-4 rounded-xl bg-white/95 border border-blue-100 shadow-2xs text-left space-y-2.5 text-xs relative z-10">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Certified Attributes Verified by this Service:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800 font-semibold">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Legal Identity Matching</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/70 border border-blue-200/60 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>Central Database Status</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50/70 border border-indigo-200/60 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span>Cryptographic Audit Ref</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-50/70 border border-violet-200/60 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
                      <span>Regulatory Compliance</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium relative z-10">
                  Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-700 font-bold shadow-2xs">↵ Enter</kbd> on any input to run verification.
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
