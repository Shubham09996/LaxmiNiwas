import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Play,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
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
  Shield,
  TrendingUp,
  Layers,
  Sparkles,
  Activity,
  History,
  Trash2,
  UserCheck,
  KeyRound,
  RefreshCw,
  Sliders,
  CheckCheck,
  Info
} from 'lucide-react';
import { ALL_APIS, TOTAL_COST_WITH_GST } from '../config/constants.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Visual3DCard from '../components/3d/Visual3DCard.jsx';

const DEFAULT_MASTER_PROFILE = {
  fullName: 'SHUBHAM GUPTA',
  mobileNumber: '9876543210',
  panNumber: 'AAACL7821M',
  aadhaarNumber: '984512348921'
};

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

export default function LiveTesterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlApiId = searchParams.get('api') || 'pan-advance';

  const [selectedApiId, setSelectedApiId] = useState(urlApiId);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL'); // 'ALL' | 'IDENTITY' | 'BUREAU'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Master Profile State (Persistent in localStorage)
  const [masterProfile, setMasterProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('lxn_master_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_MASTER_PROFILE;
    } catch {
      return DEFAULT_MASTER_PROFILE;
    }
  });

  // User input overrides (empty by default so placeholder shows)
  const [inputParams, setInputParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [recentTests, setRecentTests] = useState([]);

  const { addToast } = useToast();

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

  // Active API object
  const selectedApi = ALL_APIS.find(a => a.id === selectedApiId) || ALL_APIS[0];

  // Persist master profile
  useEffect(() => {
    try {
      localStorage.setItem('lxn_master_profile_v1', JSON.stringify(masterProfile));
    } catch {
      // Ignore storage errors
    }
  }, [masterProfile]);

  // Reset inputs to empty on switching API so placeholders show cleanly
  useEffect(() => {
    if (selectedApi) {
      setInputParams({});
      setResult(null);
      setError('');
    }
  }, [selectedApiId]);

  // Handle URL param changes
  useEffect(() => {
    if (urlApiId && ALL_APIS.some(a => a.id === urlApiId)) {
      setSelectedApiId(urlApiId);
    }
  }, [urlApiId]);

  const handleSelectApi = (apiId) => {
    setSelectedApiId(apiId);
    setSearchParams({ api: apiId });
  };

  const handleMasterChange = (key, val) => {
    setMasterProfile(prev => ({ ...prev, [key]: val }));
  };

  const handleResetMaster = () => {
    setMasterProfile(DEFAULT_MASTER_PROFILE);
    setInputParams({});
    addToast({
      title: 'Master Profile Reset',
      message: 'Restored default applicant credentials (SHUBHAM GUPTA).',
      type: 'info'
    });
  };

  const handleClearInputs = () => {
    setInputParams({});
    addToast({
      title: 'Cleared Custom Overrides',
      message: 'Active form will use default Master Profile placeholders.',
      type: 'info'
    });
  };

  const handleInputChange = (key, val) => {
    setInputParams(prev => ({ ...prev, [key]: val }));
  };

  const handleExecute = async (e) => {
    e?.preventDefault();
    if (!selectedApi) return;

    setError('');
    setLoading(true);

    try {
      // Build final payload: Use typed input value if provided, else fall back to derived placeholder
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
      setRecentTests(prev => [res, ...prev.filter(p => p.apiId !== res.apiId).slice(0, 4)]);

      if (res.success) {
        addToast({
          title: 'Live 200 OK Received',
          message: `${res.apiName} verified live in ${res.latencyMs}ms.`,
          type: 'success'
        });
      } else {
        setError(res.error || 'Upstream gateway returned an error.');
        addToast({
          title: 'Gateway Alert',
          message: res.error || 'Upstream error response',
          type: 'warning'
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to communicate with live gateway.');
      addToast({
        title: 'Communication Error',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtered APIs list
  const filteredApis = useMemo(() => {
    return ALL_APIS.filter(apiItem => {
      let matchesCategory = true;
      if (activeCategoryFilter === 'IDENTITY') {
        matchesCategory = apiItem.category !== 'Credit Bureau';
      } else if (activeCategoryFilter === 'BUREAU') {
        matchesCategory = apiItem.category === 'Credit Bureau';
      }
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        apiItem.name.toLowerCase().includes(q) ||
        apiItem.description.toLowerCase().includes(q) ||
        apiItem.tag.toLowerCase().includes(q) ||
        apiItem.details.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0B1020]/95 to-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-glow-indigo flex-shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Gateway Verification Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Connected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5 max-w-2xl">
            Single unified command center for real-time statutory, banking, employment & credit bureau verification.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-3 px-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Endpoints
            </span>
            <span className="font-mono text-sm font-extrabold text-white">
              {ALL_APIS.length} APIs (Bharat Cloud)
            </span>
          </div>

          <div className="p-3 px-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Package Cost
            </span>
            <span className="font-mono text-sm font-extrabold text-emerald-400">
              ₹ {TOTAL_COST_WITH_GST.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* MASTER PROFILE CARD (Zero Repeat Inputs) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d1527] via-[#091020] to-[#0d1527] border border-indigo-500/40 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-24 bg-indigo-600/15 blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-24 bg-emerald-600/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-glow-indigo">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Master Profile State
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                  Zero Repeat Inputs ⚡
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Set customer credentials once here. All 14 API tests will automatically use these values as placeholders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetMaster}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* 4 Core Master Inputs */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[9px] text-indigo-400 font-mono">14 APIs</span>
            </label>
            <input
              type="text"
              value={masterProfile.fullName}
              onChange={(e) => handleMasterChange('fullName', e.target.value.toUpperCase())}
              placeholder="e.g. SHUBHAM GUPTA"
              className="w-full px-3.5 py-2.5 bg-slate-950/90 focus:bg-slate-900 border border-indigo-500/30 focus:border-indigo-500 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-600 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Mobile Number</span>
              <span className="text-[9px] text-indigo-400 font-mono">10 Digits</span>
            </label>
            <input
              type="text"
              maxLength={10}
              value={masterProfile.mobileNumber}
              onChange={(e) => handleMasterChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2.5 bg-slate-950/90 focus:bg-slate-900 border border-indigo-500/30 focus:border-indigo-500 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-600 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* PAN Card Number */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>PAN Number</span>
              <span className="text-[9px] text-indigo-400 font-mono">10 AlphaNum</span>
            </label>
            <input
              type="text"
              maxLength={10}
              value={masterProfile.panNumber}
              onChange={(e) => handleMasterChange('panNumber', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="e.g. AAACL7821M"
              className="w-full px-3.5 py-2.5 bg-slate-950/90 focus:bg-slate-900 border border-indigo-500/30 focus:border-indigo-500 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-600 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Aadhaar Number</span>
              <span className="text-[9px] text-indigo-400 font-mono">12 Digits</span>
            </label>
            <input
              type="text"
              maxLength={12}
              value={masterProfile.aadhaarNumber}
              onChange={(e) => handleMasterChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 984512348921"
              className="w-full px-3.5 py-2.5 bg-slate-950/90 focus:bg-slate-900 border border-indigo-500/30 focus:border-indigo-500 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-600 focus:outline-none transition-all shadow-inner"
            />
          </div>

        </div>
      </div>

      {/* Main Single Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: 14-API Selector & Gateway Filter (4 Cols - Sticky) */}
        <div className="lg:col-span-4 sticky top-4 self-start bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-3.5">
          
          {/* Search & Filter Header */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 14 APIs (pan, uan, cibil)..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Gateway Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('ALL')}
                className={`py-1 rounded-lg transition-all text-center ${
                  activeCategoryFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({ALL_APIS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('IDENTITY')}
                className={`py-1 rounded-lg transition-all text-center ${
                  activeCategoryFilter === 'IDENTITY'
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Identity (11)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('BUREAU')}
                className={`py-1 rounded-lg transition-all text-center ${
                  activeCategoryFilter === 'BUREAU'
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bureau (3)
              </button>
            </div>
          </div>

          {/* 14 API List Items */}
          <div className="space-y-1.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {filteredApis.map((apiItem) => {
              const isSelected = apiItem.id === selectedApiId;
              const IconComponent = iconMap[apiItem.icon] || Layers;

              return (
                <button
                  key={apiItem.id}
                  onClick={() => handleSelectApi(apiItem.id)}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between gap-2.5 group ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-glow-indigo ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/60 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold flex-shrink-0 border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-indigo'
                        : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:text-white'
                    }`}>
                      #{apiItem.num < 10 ? `0${apiItem.num}` : apiItem.num}
                    </div>

                    <div className="min-w-0">
                      <span className={`text-[11px] font-bold block truncate ${
                        isSelected ? 'text-white' : 'text-slate-200 group-hover:text-indigo-300'
                      }`}>
                        {apiItem.name}
                      </span>
                      <span className="text-[9px] text-slate-500 block truncate font-mono">
                        {apiItem.tag}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-extrabold font-mono text-emerald-400 block">
                      ₹ {apiItem.cost.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Form & Real-time Visual Output (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Selected API Execution Box */}
          {selectedApi && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
              
              {/* Endpoint Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-500/30 uppercase">
                      {selectedApi.details.split('•')[0] || 'POST'}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                      {selectedApi.name}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium leading-relaxed">
                    {selectedApi.description}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Price</span>
                  <span className="font-mono text-sm font-extrabold text-emerald-400">
                    ₹ {selectedApi.cost.toFixed(2)} <span className="text-[10px] text-slate-500">incl. GST</span>
                  </span>
                </div>
              </div>

              {/* Dynamic Form Inputs */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Query Input Parameters
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={handleClearInputs}
                      className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Use Placeholders</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(selectedApi.sampleInput || {}).map((k) => {
                    const placeholderVal = getDerivedPlaceholder(selectedApi, k, masterProfile);
                    const userVal = inputParams[k] ?? '';

                    return (
                      <div key={k} className={Object.keys(selectedApi.sampleInput).length === 1 ? 'sm:col-span-2' : ''}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-300 capitalize font-mono">
                            {k.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/70 px-1.5 py-0.5 rounded border border-indigo-500/30">
                            {k}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleInputChange(k, e.target.value)}
                          placeholder={placeholderVal ? `e.g. ${placeholderVal}` : `Enter ${k}...`}
                          className="w-full px-3.5 py-2.5 bg-slate-950 focus:bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Auto-Injected Constants Banner */}
                {selectedApi.fixedRules && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>
                      <strong className="text-slate-300">Auto-Injected Backend Constants:</strong> {selectedApi.fixedRules}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] text-white font-extrabold text-sm shadow-glow-indigo flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dispatching to Bharat Cloud Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Execute Live API Test (Bharat Cloud)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Real-time Visual 3D Holographic Card & Raw JSON Viewer */}
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-3">
              Live Gateway Statutory Output
            </span>

            {result ? (
              <Visual3DCard result={result} />
            ) : (
              <div className="p-10 sm:p-14 border-2 border-dashed border-slate-800/80 rounded-3xl text-center bg-slate-900/40 backdrop-blur-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3.5 shadow-glow-indigo">
                  <Play className="w-6 h-6 fill-indigo-400 ml-0.5" />
                </div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  {selectedApi ? `${selectedApi.name} Ready` : 'Select an API'}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                  Click <strong>"Execute Live API Test"</strong> to send the query live to Bharat Cloud and inspect the real statutory verification response.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
