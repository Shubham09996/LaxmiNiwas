import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code2,
  ExternalLink,
  CreditCard,
  Fingerprint,
  Sparkles,
  FileText,
  Landmark,
  Building2,
  Car,
  Plane
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import Modal from '../components/common/Modal.jsx';

export default function ServicesCatalogPage() {
  const { services } = useVerification();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [apiDocModal, setApiDocModal] = useState(null);
  const navigate = useNavigate();

  const categories = [
    'ALL',
    'Identity & Tax',
    'Government KYC',
    'Credit & Underwriting',
    'Business & Tax',
    'Banking & Payouts',
    'Corporate Intelligence'
  ];

  const iconMap = {
    'PAN_VERIFICATION': CreditCard,
    'DIGILOCKER_KYC': Fingerprint,
    'CIBIL_CREDIT_REPORT': Sparkles,
    'GSTIN_COMPLIANCE': FileText,
    'BANK_PENNY_DROP': Landmark,
    'MCA_CORPORATE_DATA': Building2,
    'SARATHI_DL': Car,
    'PASSPORT_SEVA': Plane,
  };

  const routeMap = {
    'PAN_VERIFICATION': '/verify/pan',
    'DIGILOCKER_KYC': '/verify/digilocker',
    'CIBIL_CREDIT_REPORT': '/verify/cibil',
    'GSTIN_COMPLIANCE': '/verify/gst',
    'BANK_PENNY_DROP': '/verify/bank',
    'MCA_CORPORATE_DATA': '/verify/mca',
    'SARATHI_DL': '/verify/pan',
    'PASSPORT_SEVA': '/verify/pan',
  };

  const filtered = services.filter(s => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Enterprise Services Catalog
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete suite of statutory, financial, and identity verification gateways.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search gateways & capabilities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
            }`}
          >
            {cat === 'ALL' ? 'All Gateways (8)' : cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(service => {
          const Icon = iconMap[service.type] || Layers;
          const targetRoute = routeMap[service.type] || '/verify/pan';

          return (
            <div
              key={service.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-200/60 text-brand-700 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                  {service.title}
                </h3>
                <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                  {service.subtitle}
                </span>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Key Metrics: SLA, Accuracy, Price */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">SLA</span>
                    <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">{service.latencySla}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Accuracy</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono block mt-0.5">{service.accuracy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cost</span>
                    <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">{service.pricePerQuery}</span>
                  </div>
                </div>

                {/* Capabilities List */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Gateway Capabilities
                  </span>
                  {service.capabilities.slice(0, 3).map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(targetRoute)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <span>Verify Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setApiDocModal(service)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  title="View API Docs"
                >
                  <Code2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* API Docs / Sample Payload Modal */}
      {apiDocModal && (
        <Modal
          isOpen={!!apiDocModal}
          onClose={() => setApiDocModal(null)}
          title={`API Integration Guide — ${apiDocModal.title}`}
          subtitle={`REST Endpoint Specification (${apiDocModal.code})`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Endpoint:</span>
              <div className="font-mono bg-slate-900 text-emerald-400 p-2.5 rounded-xl mt-1 text-xs">
                POST /api/verify/{apiDocModal.id.split('-')[0]}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Headers:</span>
              <pre className="font-mono bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 text-xs">
{`Content-Type: application/json
Authorization: Bearer lxm_live_••••••••39a1`}
              </pre>
            </div>

            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Sample Request Payload:</span>
              <pre className="font-mono bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-800 text-xs overflow-x-auto">
{JSON.stringify(apiDocModal.sampleInput, null, 2)}
              </pre>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const target = routeMap[apiDocModal.type] || '/verify/pan';
                  setApiDocModal(null);
                  navigate(target);
                }}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-sm"
              >
                Launch Live Interactive Sandbox
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
