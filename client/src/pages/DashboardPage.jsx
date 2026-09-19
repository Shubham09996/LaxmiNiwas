import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Layers,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Coins,
  ArrowRight,
  Sparkles,
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
  Mail,
  Building,
  Users,
  Download,
  FileSpreadsheet,
  Play
} from 'lucide-react';
import { ALL_APIS, TOTAL_COST_PER_CUSTOMER } from '../config/constants.js';
import TiltCard from '../components/3d/TiltCard.jsx';
import QuickTestModal from '../components/modals/QuickTestModal.jsx';
import BatchPipelineRunner from '../components/pipeline/BatchPipelineRunner.jsx';

export default function DashboardPage() {
  const navigate = useNavigate();
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
      { border: 'hover:border-indigo-500/60', glow: 'rgba(99, 102, 241, 0.25)', iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
      { border: 'hover:border-emerald-500/60', glow: 'rgba(16, 185, 129, 0.25)', iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { border: 'hover:border-cyan-500/60', glow: 'rgba(6, 182, 212, 0.25)', iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { border: 'hover:border-purple-500/60', glow: 'rgba(168, 85, 247, 0.25)', iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { border: 'hover:border-amber-500/60', glow: 'rgba(245, 158, 11, 0.25)', iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { border: 'hover:border-rose-500/60', glow: 'rgba(244, 63, 94, 0.25)', iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    ];
    return accents[index % accents.length];
  };

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

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                ⚡ Full Onboarding to Disbursement Suite
              </span>
              <span className="text-xs text-slate-400 font-medium">
                20 Statutory APIs
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Laxmi Niwas Verification Platform
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium mt-2 leading-relaxed">
              Real-time gateway for instant PAN, Aadhaar e-KYC, CIBIL bureau reports, bank penny drop & AI cashflow underwriting.
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsBatchOpen(true)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-glow-indigo transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Simulate All 20 in 1-Click</span>
              </button>

              <button
                onClick={() => navigate('/apis')}
                className="px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Explore Full Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* All Gateway APIs 3D Tilt Grid Showcase */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Gateway Statutory API Suite ({ALL_APIS.length} APIs)
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Click any card to launch real-time sandbox test in an instant 3D modal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBatchOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-glow-indigo transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Simulate All 20</span>
            </button>
            <button
              onClick={() => navigate('/apis')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors shadow-inner"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Catalog</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_APIS.map((apiItem) => {
            const Icon = iconMap[apiItem.icon] || CheckCircle2;
            const accent = getApiAccent(apiItem.num - 1);

            return (
              <TiltCard
                key={apiItem.id}
                glowColor={accent.glow}
                className={`p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/90 ${accent.border} shadow-lg flex flex-col justify-between cursor-pointer group`}
                onClick={() => setSelectedQuickApi(apiItem)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${accent.iconBg} border flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-extrabold text-white bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 block">
                        ₹ {apiItem.cost.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                        incl. 18% GST
                      </span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-white block leading-tight truncate group-hover:text-indigo-300 transition-colors">
                    {apiItem.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug font-normal">
                    {apiItem.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    #{apiItem.num < 10 ? `0${apiItem.num}` : apiItem.num}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuickApi(apiItem);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Quick Test</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Benefit Pillars */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
            <span className="font-extrabold text-xs text-white block">Accurate Verification</span>
            <span className="text-[11px] text-slate-400">Direct Government & Registry Sync</span>
          </div>
          <div className="p-3">
            <Zap className="w-7 h-7 text-blue-400 mx-auto mb-2" />
            <span className="font-extrabold text-xs text-white block">Reduce Fraud Risk</span>
            <span className="text-[11px] text-slate-400">Multi-Layer Digital Checks</span>
          </div>
          <div className="p-3">
            <TrendingUp className="w-7 h-7 text-purple-400 mx-auto mb-2" />
            <span className="font-extrabold text-xs text-white block">Faster Turnaround</span>
            <span className="text-[11px] text-slate-400">Real-Time Automated Decisions</span>
          </div>
          <div className="p-3">
            <Coins className="w-7 h-7 text-amber-400 mx-auto mb-2" />
            <span className="font-extrabold text-xs text-white block">Cost Efficient</span>
            <span className="text-[11px] text-slate-400">Flat Enterprise Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
