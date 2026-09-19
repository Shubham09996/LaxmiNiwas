import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Zap,
  Search,
  CheckCircle2,
  ExternalLink,
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
  Mail,
  Building,
  Users,
  Coins,
  Download,
  FileSpreadsheet,
  LayoutGrid,
  List,
  ArrowUpDown,
  Sparkles,
  X,
  ArrowRight,
  Play
} from 'lucide-react';
import { ALL_APIS, TOTAL_COST_PER_CUSTOMER } from '../config/constants.js';
import TiltCard from '../components/3d/TiltCard.jsx';
import QuickTestModal from '../components/modals/QuickTestModal.jsx';
import BatchPipelineRunner from '../components/pipeline/BatchPipelineRunner.jsx';

export default function ApiCatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'compact'
  const [sortBy, setSortBy] = useState('default');
  
  // Modals state
  const [selectedQuickApi, setSelectedQuickApi] = useState(null);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

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
    Mail,
    Building,
    Users,
    Zap,
    Coins,
    Download,
    FileSpreadsheet
  };

  const getApiAccent = (index) => {
    const accents = [
      { border: 'hover:border-indigo-500/60', glow: 'rgba(99, 102, 241, 0.25)', iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
      { border: 'hover:border-emerald-500/60', glow: 'rgba(16, 185, 129, 0.25)', iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
      { border: 'hover:border-cyan-500/60', glow: 'rgba(6, 182, 212, 0.25)', iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
      { border: 'hover:border-purple-500/60', glow: 'rgba(168, 85, 247, 0.25)', iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
      { border: 'hover:border-amber-500/60', glow: 'rgba(245, 158, 11, 0.25)', iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
      { border: 'hover:border-rose-500/60', glow: 'rgba(244, 63, 94, 0.25)', iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
    ];
    return accents[index % accents.length];
  };

  const filteredAndSortedApis = useMemo(() => {
    let list = ALL_APIS.filter(api => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        api.name.toLowerCase().includes(q) ||
        api.description.toLowerCase().includes(q) ||
        (api.tag && api.tag.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.cost - a.cost);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => a.num - b.num);
    }

    return list;
  }, [search, sortBy]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Quick Test Modal */}
      <QuickTestModal
        apiItem={selectedQuickApi}
        isOpen={Boolean(selectedQuickApi)}
        onClose={() => setSelectedQuickApi(null)}
      />

      {/* 20-API Batch Pipeline Modal */}
      <BatchPipelineRunner
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
      />

      {/* Luxury Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#0C1226]/95 to-slate-950/95 p-8 sm:p-10 shadow-2xl border border-slate-800 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                ⚡ 20 Direct Endpoints
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Live Gateway • Instant SLA
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              API Suite & Live Testing Hub
            </h1>
            <p className="text-sm text-slate-300 font-medium mt-2 leading-relaxed">
              Transparent, flat pricing across all 20 verification APIs. Click test on any card for instant in-modal execution.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setIsBatchOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-glow-indigo transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Run Complete 20-API Pipeline Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Views */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search API (PAN, CIBIL, Bank, Aadhaar, AI)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          <span className="text-xs font-bold text-slate-400">
            <strong className="text-white">{filteredAndSortedApis.length}</strong> APIs
          </span>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="default">Default Order (1-20)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'compact'
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Compact</span>
            </button>
          </div>
        </div>
      </div>

      {/* APIS LISTING: Grid View (Next-Level 3D Cursor Tilt Cards) */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredAndSortedApis.map((apiItem) => {
            const Icon = iconMap[apiItem.icon] || CheckCircle2;
            const accent = getApiAccent(apiItem.num - 1);

            return (
              <TiltCard
                key={apiItem.id}
                glowColor={accent.glow}
                className={`group bg-slate-900/70 border border-slate-800 ${accent.border} rounded-3xl p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between cursor-pointer`}
                onClick={() => setSelectedQuickApi(apiItem)}
              >
                <div>
                  {/* Top Bar: Icon + #Num + Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl ${accent.iconBg} border flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-extrabold text-slate-500">
                        #{apiItem.num < 10 ? `0${apiItem.num}` : apiItem.num}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-base font-extrabold text-white bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800 shadow-inner">
                        ₹ {apiItem.cost.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        incl. 18% GST
                      </span>
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <div className="mb-2">
                    <h3 className="font-extrabold text-white text-base tracking-tight leading-snug group-hover:text-indigo-300 transition-colors">
                      {apiItem.name}
                    </h3>
                    {apiItem.tag && (
                      <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${accent.badge}`}>
                        {apiItem.tag}
                      </span>
                    )}
                  </div>

                  {/* Short 1-liner Description */}
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4 line-clamp-2">
                    {apiItem.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Instant SLA
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuickApi(apiItem);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs shadow-glow-indigo transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Quick Test</span>
                  </button>
                </div>
              </TiltCard>
            );
          })}
        </div>
      ) : (
        /* Compact Modern Rows */
        <div className="space-y-2.5">
          {filteredAndSortedApis.map((apiItem) => {
            const Icon = iconMap[apiItem.icon] || CheckCircle2;
            const accent = getApiAccent(apiItem.num - 1);

            return (
              <div
                key={apiItem.id}
                onClick={() => setSelectedQuickApi(apiItem)}
                className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="font-mono text-xs font-extrabold text-slate-500 w-6 text-center">
                    {apiItem.num < 10 ? `0${apiItem.num}` : apiItem.num}
                  </span>

                  <div className={`w-9 h-9 rounded-xl ${accent.iconBg} border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-white text-sm tracking-tight truncate">
                        {apiItem.name}
                      </h3>
                      {apiItem.tag && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${accent.badge}`}>
                          {apiItem.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                      {apiItem.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="font-mono text-base font-extrabold text-white bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 block">
                      ₹ {apiItem.cost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      incl. 18% GST
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuickApi(apiItem);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-glow-indigo transition-all active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Test</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Luxury Footer Card */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block mb-1">
            Complete Digital Suite
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            All 20 Statutory APIs Ready in 1 Unified Gateway
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Zero setup latency, direct NSDL/UIDAI/RBI/CIBIL gateway connectivity.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Cost</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono text-glow-emerald">
              ₹ {TOTAL_COST_PER_CUSTOMER.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setIsBatchOpen(true)}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-glow-indigo transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>Simulate All 20 in Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
