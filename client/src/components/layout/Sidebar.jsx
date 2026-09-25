import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Fingerprint,
  FileCheck,
  Landmark,
  ArrowRightLeft,
  Briefcase,
  Smartphone,
  Globe,
  MapPin,
  Shield,
  TrendingUp,
  Mail,
  Search,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { ALL_APIS } from '../../config/constants.js';
import { soundEngine } from '../../utils/soundEffects.js';

const SERVICE_GROUPS = [
  {
    id: 'IDENTITY',
    name: 'Identity & KYC',
    apiIds: ['pan-advance', 'aadhaar-fetch-without-otp', 'aadhaar-digilocker-generate', 'aadhaar-digilocker-fetch']
  },
  {
    id: 'BANKING',
    name: 'Banking & Accounts',
    apiIds: ['bank-account-verification', 'bank-ifsc-lookup', 'mobile-to-bank-advance', 'mobile-upi-lookup-enhanced']
  },
  {
    id: 'EMPLOYMENT',
    name: 'Employment & Income',
    apiIds: ['uan-lookup-mobile', 'uan-direct-history', 'work-email-plus']
  },
  {
    id: 'BUREAU',
    name: 'Credit Bureau Reports',
    apiIds: ['cibil-transunion-pdf', 'experian-credit-report', 'crif-credit-score-v4']
  },
  {
    id: 'SECURITY',
    name: 'Risk & Intelligence',
    apiIds: ['mobile-profile-prefill', 'ip-fraud-geolocation', 'reverse-geocoding', 'domain-age-security']
  }
];

const GROUP_COLOR_MAP = {
  IDENTITY: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    iconBg: 'bg-emerald-50/90 text-emerald-600 border border-emerald-200/70',
    dot: 'bg-emerald-500'
  },
  BANKING: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    iconBg: 'bg-blue-50/90 text-blue-600 border border-blue-200/70',
    dot: 'bg-blue-500'
  },
  EMPLOYMENT: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconBg: 'bg-amber-50/90 text-amber-600 border border-amber-200/70',
    dot: 'bg-amber-500'
  },
  BUREAU: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    iconBg: 'bg-indigo-50/90 text-indigo-600 border border-indigo-200/70',
    dot: 'bg-indigo-500'
  },
  SECURITY: {
    badge: 'bg-violet-50 text-violet-700 border-violet-200/80',
    iconBg: 'bg-violet-50/90 text-violet-600 border border-violet-200/70',
    dot: 'bg-violet-500'
  }
};

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
  TrendingUp,
  Mail
};

export default function Sidebar({
  selectedApiId,
  onSelectService,
  searchQuery,
  onSearchChange,
  isMobileOpen,
  onMobileClose
}) {
  const searchInputRef = useRef(null);

  const apisById = useMemo(() => {
    const map = {};
    ALL_APIS.forEach(a => {
      map[a.id] = a;
    });
    return map;
  }, []);

  // Keyboard shortcut listener (/ to search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredGroups = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return SERVICE_GROUPS;

    return SERVICE_GROUPS.map(group => {
      const matchedApiIds = group.apiIds.filter(id => {
        const item = apisById[id];
        if (!item) return false;
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.tag && item.tag.toLowerCase().includes(q))
        );
      });
      return {
        ...group,
        apiIds: matchedApiIds
      };
    }).filter(group => group.apiIds.length > 0);
  }, [searchQuery, apisById]);

  const handleItemClick = (apiId) => {
    soundEngine.playClick();
    onSelectService(apiId);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Modern High-End Light Sidebar Frame */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#FAFBFD] text-slate-800 border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out select-none lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">

          {/* Institutional Brand Header */}
          <div className="h-16 px-4 border-b border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between flex-shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-600 p-[1.5px] shadow-sm shadow-brand-500/25 flex-shrink-0">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
                  <img
                    src="/logo.svg"
                    alt="Laxmi Niwas"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                    Laxmi Niwas
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide block mt-0.5">
                  Verification Platform
                </span>
              </div>
            </div>

            {isMobileOpen && (
              <button
                type="button"
                onClick={onMobileClose}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Search */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search services... (Press /)"
                className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200/90 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-100 border border-slate-200 rounded text-slate-400 shadow-2xs pointer-events-none">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Interactive Service Navigator List */}
          <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-5 text-xs custom-scrollbar">
            {filteredGroups.map(group => {
              const groupColors = GROUP_COLOR_MAP[group.id] || GROUP_COLOR_MAP.IDENTITY;

              return (
                <div key={group.id} className="space-y-1">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-[0.04em] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${groupColors.dot}`}></span>
                      <span>{group.name}</span>
                    </div>
                    <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${groupColors.badge}`}>
                      {group.apiIds.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {group.apiIds.map(apiId => {
                      const item = apisById[apiId];
                      if (!item) return null;
                      const isSelected = selectedApiId === item.id;
                      const IconComp = iconMap[item.icon] || CreditCard;

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative cursor-pointer ${isSelected
                            ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-semibold shadow-md shadow-blue-500/25 border border-transparent'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-2xs border border-transparent'
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                              ? 'bg-white text-blue-600 shadow-2xs font-bold'
                              : `${groupColors.iconBg} group-hover:bg-white group-hover:shadow-2xs`
                              }`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className={`text-[12.5px] tracking-[-0.01em] truncate block leading-snug ${isSelected ? 'text-white font-bold' : 'text-slate-800 font-semibold group-hover:text-slate-900'
                                }`}>
                                {item.name}
                              </span>
                              <span className={`text-[11px] font-mono block leading-none mt-0.5 ${isSelected ? 'text-blue-100 font-semibold' : 'text-slate-400 font-medium group-hover:text-slate-600'
                                }`}>
                                ₹{item.cost.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            className={`w-3.5 h-3.5 flex-shrink-0 transition-all ${isSelected
                              ? 'text-white translate-x-0 opacity-100'
                              : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                              }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredGroups.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching services found.
              </div>
            )}
          </div>

          {/* Institutional Status & Latency Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/80 text-[11px] text-slate-500 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{ALL_APIS.length} APIs Live</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
              99.98% SLA
            </span>
          </div>

        </div>
      </aside>
    </>
  );
}
