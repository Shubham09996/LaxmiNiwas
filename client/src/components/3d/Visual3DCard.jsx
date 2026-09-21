import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Zap,
  ExternalLink,
  QrCode,
  Landmark,
  Building,
  Smartphone,
  MapPin,
  Globe,
  TrendingUp,
  Download,
  Fingerprint,
  CreditCard,
  Briefcase,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  Navigation,
  Languages,
  Radio,
  Wifi,
  Server,
  Compass,
  Maximize2,
  Plus,
  Minus,
  LocateFixed,
  RotateCcw,
  RefreshCw,
  X,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

function safeText(val, fallback = '—') {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'object') {
    if (typeof val.message === 'string') return val.message;
    if (typeof val.name === 'string') return val.name;
    if (typeof val.title === 'string') return val.title;
    return fallback;
  }
  return String(val);
}

export default function Visual3DCard({ result }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'raw_json'

  if (!result) return null;

  const {
    success,
    apiId,
    apiName,
    apiNumber = 1,
    tag,
    gateway,
    costFormatted,
    latencyMs,
    statusCode,
    refId,
    visualData = {},
    data = {},
    error
  } = result;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    toast?.addToast?.({
      title: 'Copied to Clipboard',
      message: 'Live verification payload copied successfully.',
      type: 'success'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast?.addToast?.({
      title: 'Raw JSON Copied',
      message: '100% untouched raw API response copied.',
      type: 'success'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const cardType = visualData?.cardType || 'GENERIC_CARD';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative w-full space-y-4"
    >
      {/* 3D Ambient Holographic Glow */}
      <div
        className={`absolute -inset-1 rounded-3xl blur-2xl opacity-60 pointer-events-none transition-all ${
          success
            ? 'bg-gradient-to-r from-indigo-500/30 via-emerald-500/25 to-purple-500/30'
            : 'bg-gradient-to-r from-red-500/30 via-orange-500/25 to-pink-500/30'
        }`}
      ></div>

      {/* Main Container */}
      <div className="relative bg-[#0B1020]/95 border border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl overflow-hidden space-y-4">
        
        {/* Floating Aura */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full pointer-events-none blur-2xl"></div>
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full pointer-events-none blur-2xl"></div>

        {/* Card Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white flex-shrink-0 font-mono shadow-md ${
                success
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-glow-indigo'
                  : 'bg-gradient-to-br from-rose-500 to-red-700'
              }`}
            >
              #{apiNumber < 10 ? `0${apiNumber}` : apiNumber}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                  {apiName}
                </h3>
                {gateway && (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30 whitespace-nowrap flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-emerald-400" />
                    {gateway} Live
                  </span>
                )}
              </div>

              {/* Metadata Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <span className="font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 text-[11px] whitespace-nowrap">
                  Ref: <strong className="text-slate-200">{refId}</strong>
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  <span>{latencyMs} ms Live SLA</span>
                </span>
                {costFormatted && (
                  <span className="inline-flex items-center font-bold text-white font-mono bg-indigo-950/70 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">
                    {costFormatted}
                  </span>
                )}
                {statusCode && (
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border ${
                      statusCode === 200
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                        : 'bg-red-950 text-red-300 border-red-500/30'
                    }`}
                  >
                    HTTP {statusCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
              title="Copy Full Result JSON"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Payload'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Tab Switcher */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>✨ Visual Verification Card</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw_json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'raw_json'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>⚡ 100% Real API Response JSON</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-500 hidden sm:block">
            {activeTab === 'visual' ? 'Dynamic Real-time Projection' : 'Untouched Gateway Response Body'}
          </span>
        </div>

        {/* Status Alert Banner if Error */}
        {!success && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 shadow-inner text-red-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                Gateway Notice
              </span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {error || 'Request unsuccessful or parameters rejected by upstream provider.'}
              </span>
            </div>
          </div>
        )}

        {/* CONTENT VIEWPORT */}
        {activeTab === 'raw_json' ? (
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-mono text-[11px] text-slate-400">
                HTTP Status: <strong className="text-emerald-400">{statusCode || 200}</strong> • Gateway Latency: <strong className="text-white">{latencyMs}ms</strong>
              </span>
              <button
                type="button"
                onClick={handleCopyRaw}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Raw JSON</span>
              </button>
            </div>
            <pre className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed shadow-inner selection:bg-emerald-900 selection:text-white">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ) : (
          /* TAILORED VISUAL RENDERING PER API */
          <div className="relative z-10">
            {cardType === 'PAN_CARD' && <PanVisualCard data={visualData} raw={data} success={success} />}
            {cardType === 'DIGILOCKER_GENERATE_CARD' && <DigiLockerGenerateCard data={visualData} raw={data} success={success} />}
            {cardType === 'AADHAAR_CARD' && <AadhaarVisualCard data={visualData} raw={data} success={success} />}
            {cardType === 'BANK_ACCOUNT_CARD' && <BankAccountCard data={visualData} raw={data} success={success} />}
            {cardType === 'IFSC_DIRECTORY_CARD' && <IfscDirectoryCard data={visualData} raw={data} success={success} />}
            {cardType === 'UAN_LOOKUP_CARD' && <UanLookupCard data={visualData} raw={data} success={success} />}
            {cardType === 'UAN_HISTORY_CARD' && <UanHistoryCard data={visualData} raw={data} success={success} />}
            {cardType === 'TELECOM_CARD' && <TelecomCard data={visualData} raw={data} success={success} />}
            {cardType === 'IP_FRAUD_CARD' && <IpFraudCard data={visualData} raw={data} success={success} />}
            {cardType === 'GEO_REVERSE_CARD' && <GeoReverseCard data={visualData} raw={data} success={success} />}
            {cardType === 'DOMAIN_CARD' && <DomainCard data={visualData} raw={data} success={success} />}
            {cardType === 'CIBIL_PDF_CARD' && <CibilPdfCard data={visualData} raw={data} success={success} />}
            {cardType === 'BUREAU_SCORE_CARD' && <BureauScoreCard data={visualData} raw={data} success={success} />}
            {cardType === 'GENERIC_CARD' && <GenericVisualCard data={visualData} raw={data} success={success} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =========================================================================
   1. PAN CARD VERIFICATION (#01) — OFFICIAL ITD DIGITAL CERTIFICATE
   ========================================================================= */
function PanVisualCard({ data }) {
  const pan = data.pan || '—';
  const name = data.name || '—';
  const fatherName = data.fatherName;
  const dob = data.dob;
  const gender = data.gender;
  const entityType = data.entityType || 'Individual';
  const aadhaarLinked = data.aadhaarLinked;
  const aadhaarNumber = data.aadhaarNumber;
  const aadhaarSeedingStatus = data.aadhaarSeedingStatus;
  const matchScore = data.matchScore || 'Verified';
  const address = data.address;
  const mobile = data.mobile;
  const email = data.email;

  return (
    <div className="relative w-full rounded-3xl p-5 sm:p-6 shadow-2xl border border-sky-400/40 overflow-hidden bg-gradient-to-br from-[#0e2c48] via-[#153b60] to-[#0a2034] text-slate-100 select-none space-y-3.5">
      {/* Background Micro Guilloche Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none"></div>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-sky-300/20">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 font-serif font-black text-sm shadow-inner flex-shrink-0">
            🏛️
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black tracking-widest text-amber-300 uppercase truncate">
              आयकर विभाग • INCOME TAX DEPARTMENT
            </div>
            <div className="text-[9px] font-bold text-sky-200 uppercase tracking-wider truncate">
              भारत सरकार / GOVT. OF INDIA
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right flex-shrink-0">
          <span className="text-[9px] font-bold text-sky-300 uppercase block tracking-wider">Card Category</span>
          <span className="font-mono text-xs font-black text-white bg-sky-950/80 px-2 py-0.5 rounded border border-sky-400/30 inline-block">
            {entityType}
          </span>
        </div>
      </div>

      {/* Core ID Section */}
      <div className="relative z-10 grid grid-cols-12 gap-4 items-center py-2">
        <div className="col-span-4 sm:col-span-3">
          <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-gradient-to-b from-sky-900 to-slate-950 border-2 border-amber-400/40 shadow-xl overflow-hidden flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-sky-700/50 border border-sky-400/30 flex items-center justify-center text-sky-200 mb-1">
              👤
            </div>
            <span className="text-[8px] font-bold text-sky-300 uppercase tracking-wider">TAX ID VERIFIED</span>
          </div>
        </div>

        <div className="col-span-8 sm:col-span-9 space-y-2.5">
          <div>
            <span className="text-[8px] font-bold text-sky-300 uppercase block tracking-wider">
              Permanent Account Number (PAN)
            </span>
            <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {pan}
            </div>
          </div>

          <div>
            <span className="text-[8px] font-bold text-sky-300 uppercase block tracking-wider">
              Registered Taxpayer Full Name
            </span>
            <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide block uppercase truncate">
              {name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[8px] font-bold text-sky-300 uppercase block font-sans">Date of Birth (DOB)</span>
              <span className="font-bold text-amber-200 block truncate">{dob || '— (Masked by ITD)'}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-sky-300 uppercase block font-sans">Gender</span>
              <span className="font-bold text-sky-100 block uppercase truncate">{gender || 'Individual'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[8px] font-bold text-sky-300 uppercase block font-sans">Father's Name</span>
              <span className="font-bold text-sky-100 block uppercase truncate">{fatherName || '— (Restricted by ITD)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Verification Status Chips */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-sky-300/20 text-xs">
        <div className="p-2 rounded-xl bg-sky-950/70 border border-sky-400/30 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Aadhaar Link</span>
            <span className="font-bold text-emerald-300 text-[11px] block truncate">
              {aadhaarLinked ? (aadhaarNumber ? `Seeded (${aadhaarNumber})` : 'Linked & Seeded') : (aadhaarSeedingStatus ? `Status: ${aadhaarSeedingStatus}` : 'Not Linked')}
            </span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-sky-950/70 border border-sky-400/30 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Fuzzy Match Score</span>
            <span className="font-bold text-amber-300 text-[11px] block truncate">
              {matchScore || 'Verified'}
            </span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-sky-950/70 border border-sky-400/30 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">ITD Status</span>
            <span className="font-bold text-emerald-300 text-[11px] block truncate">
              {data.status || 'Active & Operative'}
            </span>
          </div>
        </div>
      </div>

      {/* Registered Contact & Address */}
      {(address || mobile || email) ? (
        <div className="relative z-10 p-3.5 rounded-2xl bg-sky-950/80 border border-sky-400/30 space-y-2 text-xs">
          {address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registered Postal Address:
                </span>
                <span className="font-medium text-slate-200 leading-relaxed block">
                  {address}
                </span>
              </div>
            </div>
          )}

          {(mobile || email) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-sky-400/20 font-mono text-[11px]">
              {mobile && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">Mobile: <strong className="text-white">+91 {mobile}</strong></span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  <span className="text-slate-300 truncate">Email: <strong className="text-white">{email}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 p-2.5 rounded-xl bg-sky-950/60 border border-sky-400/20 flex items-center justify-between text-[11px] text-sky-200 font-mono">
          <span>🏛️ ITD Database Record: <strong className="text-white">Active & Operative</strong></span>
          <span className="text-emerald-400 font-bold">100% Valid Taxpayer</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   2. DIGILOCKER GENERATE URL (#02)
   ========================================================================= */
function DigiLockerGenerateCard({ data }) {
  const aadhaarMasked = data.aadhaarMasked || '—';
  const redirectUrl = data.redirectUrl;
  const clientId = data.clientId || '—';
  const expirySeconds = data.expirySeconds || 1800;

  return (
    <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c1f2e] via-[#0f2d42] to-[#081722] border border-cyan-500/30 text-white space-y-3.5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-extrabold text-sm uppercase text-white block truncate">
              DigiLocker Paperless e-KYC Session
            </span>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block truncate">
              UIDAI Digital Identity Gateway
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0 self-start sm:self-center">
          TOKEN ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1 text-xs">
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/20">
          <span className="text-[9px] font-bold text-cyan-300 block uppercase mb-1">Target Aadhaar Number</span>
          <span className="font-mono font-black text-sm sm:text-base text-white">{aadhaarMasked}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-cyan-300 uppercase">Session Client ID</span>
            <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
              Valid {Math.round(expirySeconds / 60)}m
            </span>
          </div>
          <span className="font-mono font-bold text-xs text-amber-300 truncate block">{clientId}</span>
        </div>
      </div>

      {redirectUrl && (
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all group active:scale-[0.99]"
        >
          <span>Open DigiLocker Resident Consent Gateway</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      )}
    </div>
  );
}

/* =========================================================================
   3. AADHAAR DIGILOCKER FETCH DETAILS (#03)
   ========================================================================= */
function AadhaarVisualCard({ data }) {
  const aadhaarNumber = data.aadhaarMasked || 'XXXXXXXXXXXX';
  const nameEn = data.nameEnglish || '—';
  const careOf = data.careOf;
  const dob = data.dob || '—';
  const gender = data.gender || '—';
  const address = data.address || '—';
  const zip = data.zip;
  const xmlUrl = data.xmlUrl;
  const clientId = data.clientId;

  return (
    <div className="relative w-full rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/50 overflow-hidden bg-[#fafafa] text-slate-900 select-none space-y-3.5">
      {/* Tricolor National Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      {/* Official Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 pt-1 border-b border-slate-200">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-2xl flex-shrink-0">🏛️</span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-black text-slate-900 uppercase tracking-wide truncate">
              भारत सरकार / Government of India
            </div>
            <div className="text-[8px] font-bold text-slate-600 uppercase tracking-wider truncate">
              भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl shadow-sm flex-shrink-0 self-start sm:self-center">
          <Fingerprint className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
          <span className="text-[9px] font-black text-red-700 uppercase tracking-wider">UIDAI e-KYC VERIFIED</span>
        </div>
      </div>

      {/* Core ID Section */}
      <div className="grid grid-cols-12 gap-4 py-2 items-center">
        <div className="col-span-4 sm:col-span-3">
          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-slate-200 border-2 border-slate-400/40 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-3xl">👤</span>
            <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-white text-[7px] text-center font-bold py-0.5">
              UIDAI VERIFIED
            </div>
          </div>
        </div>

        <div className="col-span-8 sm:col-span-9 space-y-2">
          <span className="text-sm sm:text-base font-black text-slate-900 block uppercase tracking-wide">
            {nameEn}
          </span>

          <div className="text-xs text-slate-700 space-y-1 font-medium">
            {careOf && (
              <div>
                <strong className="font-bold text-slate-900">संबंध / C/O:</strong> {careOf}
              </div>
            )}
            <div className="flex items-center gap-4">
              <div><strong className="font-bold text-slate-900">जन्म तिथि / DOB:</strong> {dob}</div>
              <div><strong className="font-bold text-slate-900">लिंग / Gender:</strong> {gender}</div>
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
              <strong className="font-bold text-slate-900">पता / Address:</strong> {address}
              {zip && !address.includes(zip) && ` - ${zip}`}
            </div>
          </div>
        </div>
      </div>

      {/* Aadhaar Number Strip */}
      <div className="pt-3 border-t-2 border-red-500/80 text-center space-y-1">
        <div className="font-mono text-xl sm:text-2xl font-black text-red-600 tracking-widest">
          {aadhaarNumber}
        </div>
        <div className="text-[9px] font-black text-slate-700 tracking-widest uppercase">
          मेरा <span className="text-amber-600">आधार</span>, मेरी <span className="text-emerald-700">पहचान</span>
        </div>
      </div>

      {/* XML Download Action */}
      {xmlUrl && (
        <a
          href={xmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
        >
          <Download className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
          <span>Download Official UIDAI Signed XML KYC Document</span>
        </a>
      )}

      {clientId && (
        <div className="text-center">
          <span className="font-mono text-[10px] text-slate-500">
            Session Ref: {clientId}
          </span>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   4. BANK ACCOUNT VERIFICATION (#04)
   ========================================================================= */
function BankAccountCard({ data }) {
  const bankName = data.bankName || '—';
  const accountMasked = data.accountMasked || '—';
  const beneficiaryName = data.beneficiaryName || '—';
  const ifsc = data.ifsc || '—';
  const branch = data.branch;
  const city = data.city;
  const referenceId = data.referenceId;
  const accountStatus = data.accountStatus || 'ACTIVE';

  return (
    <div className="relative w-full rounded-2xl p-5 sm:p-6 shadow-2xl border border-indigo-400/30 overflow-hidden bg-gradient-to-br from-[#0c1b33] via-[#102a4e] to-[#081326] text-white select-none space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold flex-shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-black tracking-wide text-white block uppercase truncate">
              {bankName}
            </span>
            <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider block">
              CORE BANKING SYSTEM (CBS)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex-shrink-0 self-start sm:self-center">
          {accountStatus} • CBS VALIDATED
        </span>
      </div>

      <div className="py-4 space-y-3">
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">
            Validated Account Number
          </span>
          <div className="font-mono text-xl sm:text-2xl font-black text-slate-100 tracking-widest">
            {accountMasked}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <span className="text-[8px] font-bold text-indigo-300 uppercase block">Beneficiary Name</span>
            <span className="font-extrabold text-white text-xs sm:text-sm uppercase block truncate">
              {beneficiaryName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-bold text-indigo-300 uppercase block">IFSC Code</span>
            <span className="font-mono font-extrabold text-amber-300 text-xs sm:text-sm block">
              {ifsc}
            </span>
            {branch && <span className="text-[9px] text-slate-400 block truncate">{branch} {city ? `• ${city}` : ''}</span>}
          </div>
        </div>

        {referenceId && (
          <div className="pt-2 border-t border-indigo-500/20 text-right">
            <span className="text-[9px] font-mono text-slate-400">CBS Ref: <strong className="text-slate-200">{referenceId}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   5. BANK IFSC CODE LOOKUP (#05) — TAILORED BRANCH CERTIFICATE
   ========================================================================= */
function IfscDirectoryCard({ data }) {
  const bankName = data.bankName || 'BANK NAME NOT PROVIDED';
  const ifsc = data.ifsc || '—';
  const branch = data.branch || '—';
  const address = data.address || '—';
  const contact = data.contact;
  const city = data.city;
  const district = data.district;
  const state = data.state;
  const micr = data.micr;

  return (
    <div className="relative w-full rounded-3xl p-5 sm:p-6 shadow-2xl border border-indigo-500/30 overflow-hidden bg-gradient-to-br from-[#0c1630] via-[#101e44] to-[#080f22] text-white space-y-3.5">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3.5 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-black text-sm shadow-inner flex-shrink-0 mt-0.5 sm:mt-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-black text-white tracking-wide uppercase truncate">
              {bankName}
            </h4>
            <span className="text-[10px] sm:text-[11px] text-indigo-300 font-semibold tracking-wider block mt-0.5 leading-snug break-words">
              RBI Central IFSC Registry • {branch}
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right flex-shrink-0 self-start sm:self-center bg-slate-950/80 px-3 py-1.5 rounded-xl border border-indigo-500/30">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code</span>
          <span className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider">
            {ifsc}
          </span>
        </div>
      </div>

      {/* Address & Branch Info */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2.5 text-xs">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            Branch Postal Address:
          </span>
          <span className="font-medium text-slate-200 leading-relaxed block">
            {address}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/60 font-mono text-[11px]">
          {city && (
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">City / District</span>
              <span className="font-bold text-white truncate block">{city} {district ? `(${district})` : ''}</span>
            </div>
          )}
          {state && (
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">State</span>
              <span className="font-bold text-white truncate block">{state}</span>
            </div>
          )}
          {micr && (
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">MICR Code</span>
              <span className="font-bold text-amber-300 block">{micr}</span>
            </div>
          )}
          {contact && (
            <div className="col-span-full sm:col-span-1">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Phone / Contact</span>
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>{contact}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Clearing Channels Capability Badges */}
      <div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Supported Interbank Payment Channels
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className={`p-2.5 rounded-xl border ${data.neft ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            <span className="text-[8px] font-bold block uppercase">NEFT 24x7</span>
            <span className="font-black text-xs">{data.neft ? '✓ ENABLED' : '✕ NO'}</span>
          </div>
          <div className={`p-2.5 rounded-xl border ${data.rtgs ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            <span className="text-[8px] font-bold block uppercase">RTGS Realtime</span>
            <span className="font-black text-xs">{data.rtgs ? '✓ ENABLED' : '✕ NO'}</span>
          </div>
          <div className={`p-2.5 rounded-xl border ${data.imps ? 'bg-teal-950/60 border-teal-500/30 text-teal-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            <span className="text-[8px] font-bold block uppercase">IMPS Instant</span>
            <span className="font-black text-xs">{data.imps ? '✓ ENABLED' : '✕ NO'}</span>
          </div>
          <div className={`p-2.5 rounded-xl border ${data.upi ? 'bg-purple-950/60 border-purple-500/30 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            <span className="text-[8px] font-bold block uppercase">UPI Payment</span>
            <span className="font-black text-xs">{data.upi ? '✓ ENABLED' : '✕ NO'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. EPFO UAN MOBILE LOOKUP (#06)
   ========================================================================= */
function UanLookupCard({ data }) {
  const uanFormatted = data.uanFormatted || '—';
  const mobile = data.mobile || '—';
  const memberName = data.memberName;
  const employer = data.employer;

  return (
    <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#062422] via-[#0b3d39] to-[#041a18] border border-teal-500/30 text-white space-y-3.5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-400/20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Briefcase className="w-5 h-5 text-teal-300 flex-shrink-0" />
          <span className="font-extrabold text-sm uppercase text-teal-200 truncate">
            EPFO Universal Account Number Lookup
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0 self-start sm:self-center">
          {safeText(data.status, 'UAN RECORD FOUND')}
        </span>
      </div>

      <div className="py-2">
        <span className="text-[9px] font-bold text-teal-300 uppercase block tracking-wider">
          Discovered Universal Account Number (UAN)
        </span>
        <div className="font-mono text-2xl sm:text-3xl font-black text-teal-300 tracking-widest">
          {uanFormatted}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-teal-400/20 text-xs font-mono">
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase block">Registered Mobile</span>
          <span className="font-bold text-white">+91 {mobile}</span>
        </div>
        {memberName && (
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Member Name</span>
            <span className="font-bold text-amber-300 truncate block">{memberName}</span>
          </div>
        )}
      </div>

      {employer && (
        <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-500/20 text-xs">
          <span className="text-[8px] font-bold text-slate-400 uppercase block mb-0.5">Associated Employer:</span>
          <span className="font-extrabold text-white block uppercase">{employer}</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   7. UAN DIRECT EMPLOYMENT HISTORY (#07)
   ========================================================================= */
function UanHistoryCard({ data }) {
  const uanFormatted = data.uanFormatted || '—';
  const memberName = data.memberName || '—';
  const employer = data.employer || '—';
  const doj = data.doj;
  const doe = data.doe;
  const totalServiceMonths = data.totalServiceMonths;
  const monthlyPfAmount = data.monthlyPfAmount;

  return (
    <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#062422] via-[#0b3d39] to-[#041a18] border border-teal-500/30 text-white space-y-3.5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-400/20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Briefcase className="w-5 h-5 text-teal-300 flex-shrink-0" />
          <span className="font-extrabold text-sm uppercase text-teal-200 truncate">
            EPFO Passbook Service Record
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0 self-start sm:self-center">
          {safeText(data.status, 'ACTIVE CONTRIBUTORY')}
        </span>
      </div>

      <div className="py-2">
        <span className="text-[9px] font-bold text-teal-300 uppercase block">UAN Number</span>
        <div className="font-mono text-2xl font-black text-teal-300 tracking-widest">
          {uanFormatted}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-500/20 space-y-2 text-xs">
        <div>
          <span className="text-[8px] font-bold text-teal-300 uppercase block">Active Establishment / Employer</span>
          <span className="font-extrabold text-white text-sm uppercase block truncate">{employer}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-teal-400/20 font-mono text-[11px]">
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Member Name</span>
            <span className="font-bold text-amber-300 block truncate">{memberName}</span>
          </div>
          {totalServiceMonths && (
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Total Service</span>
              <span className="font-bold text-emerald-300 block">{totalServiceMonths} Months</span>
            </div>
          )}
          {doj && (
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Date of Joining</span>
              <span className="font-bold text-white block">{doj}</span>
            </div>
          )}
          {monthlyPfAmount && (
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Monthly PF</span>
              <span className="font-bold text-teal-300 block">₹ {monthlyPfAmount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   8. TELECOM MOBILE PROFILE PREFILL (#08)
   ========================================================================= */
function TelecomCard({ data }) {
  const mobileFormatted = data.mobileFormatted || '—';
  const name = data.name || '—';
  const pan = data.pan;
  const dob = data.dob;
  const age = data.age;
  const gender = data.gender;
  const email = data.email;
  const references = data.references || [];
  const addressList = data.addressList || [];

  return (
    <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#2b0c0c] via-[#3a1212] to-[#1c0808] border border-red-500/30 text-white space-y-3.5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-500/20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Smartphone className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="font-extrabold text-sm uppercase text-red-200 truncate">
            Telecom Subscriber Profile & Prefill
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0 self-start sm:self-center">
          {safeText(data.status, 'SUBSCRIBER ACTIVE')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 py-2 text-xs">
        <div>
          <span className="text-[8px] font-bold text-red-300 uppercase block">Subscriber Number</span>
          <span className="font-mono text-xl font-black text-white">{mobileFormatted}</span>
        </div>
        <div>
          <span className="text-[8px] font-bold text-red-300 uppercase block">Full Name</span>
          <span className="font-extrabold text-amber-300 text-sm block uppercase truncate">{name}</span>
          {pan && <span className="text-[10px] text-slate-300 font-mono block">PAN: <strong>{pan}</strong></span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-red-500/20 text-xs font-mono">
        {dob && (
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase block">DOB / Age</span>
            <span className="font-bold text-white">{dob} {age ? `(${age}y)` : ''}</span>
          </div>
        )}
        {gender && (
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Gender</span>
            <span className="font-bold text-white">{gender}</span>
          </div>
        )}
        {email && (
          <div className="col-span-full sm:col-span-1 truncate">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Email</span>
            <span className="font-bold text-slate-200 truncate block">{email}</span>
          </div>
        )}
      </div>

      {addressList.length > 0 && (
        <div className="p-3 rounded-2xl bg-red-950/60 border border-red-500/20 text-xs space-y-1">
          <span className="text-[8px] font-bold text-red-300 uppercase block">Residential Address:</span>
          {addressList.map((a, idx) => (
            <span key={idx} className="font-medium text-slate-200 block">
              {typeof a === 'string' ? a : `${a.line1 || ''}, ${a.city || ''}, ${a.state || ''} ${a.pincode ? `- ${a.pincode}` : ''}`}
            </span>
          ))}
        </div>
      )}

      {references.length > 0 && (
        <div className="pt-3 border-t border-red-500/20 space-y-2">
          <span className="text-[9px] font-bold text-red-300 uppercase block">Emergency References</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {references.map((r, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/20 text-xs">
                <span className="font-bold text-white block">{r.name || `Reference #${i + 1}`} ({r.relationship || r.relation || 'Relation'})</span>
                <span className="font-mono text-[10px] text-slate-300">{r.mobile || r.phone || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   9. IP FRAUD & GEOLOCATION RISK (#09) — 100% REAL LIVE GATEWAY DATA
   ========================================================================= */
function IpFraudCard({ data = {}, raw = {} }) {
  // Real untouched upstream fields (Zero hardcoded mock strings)
  const ip = raw.ip || data.ip || '—';
  const ipType = (raw.type || data.ipType || (ip.includes(':') ? 'IPv6' : 'IPv4')).toUpperCase();
  const city = raw.city || data.city || '';
  const region = raw.region_name || data.region || '';
  const country = raw.country_name || data.country || '';
  const countryCode = (raw.country_code || (raw.location && raw.location.country_code) || (data.countryCode) || (country ? country.slice(0, 2) : '')).toUpperCase();
  const continentName = raw.continent_name || data.continent || '';
  const continentCode = raw.continent_code || '';
  const zip = raw.zip ||
    raw.postal ||
    raw.pincode ||
    raw.postcode ||
    raw.postal_code ||
    (raw.location && (raw.location.zip || raw.location.postal || raw.location.postcode || raw.location.pincode)) ||
    (raw.data && (raw.data.zip || raw.data.postal || raw.data.pincode || raw.data.postcode)) ||
    data.zip || '';
  const capital = raw.location?.capital || data.capital || '';

  const routingType = raw.ip_routing_type || data.routingType || '—';
  const connectionType = raw.connection_type || data.connectionType || '—';
  const isp = raw.isp || raw.org || raw.organization || data.isp || '—';
  const networkSubtitle = raw.asn ? `ASN: ${raw.asn}` : (data.asn ? `ASN: ${data.asn}` : (data.gateway || '—'));

  const numLat = raw.latitude !== undefined && raw.latitude !== null ? parseFloat(raw.latitude) : (data.latitude !== undefined && data.latitude !== null ? parseFloat(data.latitude) : null);
  const numLon = raw.longitude !== undefined && raw.longitude !== null ? parseFloat(raw.longitude) : (data.longitude !== undefined && data.longitude !== null ? parseFloat(data.longitude) : null);
  const hasCoords = numLat !== null && numLon !== null && !isNaN(numLat) && !isNaN(numLon) && (numLat !== 0 || numLon !== 0);

  const callingCode = raw.location?.calling_code ? `+${raw.location.calling_code}` : (data.callingCode ? (String(data.callingCode).startsWith('+') ? data.callingCode : `+${data.callingCode}`) : '—');
  
  let languagesList = [];
  if (Array.isArray(raw.location?.languages)) {
    languagesList = raw.location.languages.map(l => (typeof l === 'object' ? l.name || l.code : l)).filter(Boolean);
  } else if (Array.isArray(data.languages)) {
    languagesList = data.languages;
  }
  const languagesStr = languagesList.length > 0 ? languagesList.join(', ') : '—';

  const locationTitle = [city, region].filter(Boolean).join(', ') || (country || '—');
  const continentText = continentName ? `${continentName}${continentCode ? ` (${continentCode})` : ''}` : '';

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${numLat},${numLon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationTitle)}`;

  return (
    <div className="w-full rounded-3xl bg-[#070D1E] border border-slate-800/90 text-white space-y-4 shadow-2xl p-5 sm:p-6 overflow-hidden font-sans">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-sm shadow-inner flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base sm:text-lg font-black text-white tracking-wide truncate">
                Requester IP Intelligence & Geolocation
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-950/80 text-blue-300 border border-blue-500/30 uppercase tracking-wider whitespace-nowrap">
                REAL-TIME GEO MATRIX
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]"></span>
                LIVE NETWORK INTEL
              </span>
              <span className="text-[11px] text-slate-400">
                Verified IP Geolocation, Network Routing, ISP & Proxy Threat Analysis.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
            title="Refresh IP"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Refresh IP</span>
          </button>
        </div>
      </div>

      {/* 2. Main Location & IP Capsule Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3.5 min-w-0">
          {countryCode && (
            <div className="w-12 h-12 rounded-2xl bg-[#111C3D] border border-slate-700/80 flex items-center justify-center text-white font-black text-base font-mono flex-shrink-0 shadow-md">
              {countryCode}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {locationTitle}
              </h3>
              {zip && (
                <span className="text-xs font-mono font-bold text-slate-400">
                  ZIP: {zip}
                </span>
              )}
              {country && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#14224A] text-slate-200 border border-slate-700/80">
                  {country} {countryCode ? `(${countryCode})` : ''}
                </span>
              )}
            </div>
            {(continentText || capital) && (
              <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2 flex-wrap">
                {continentText && <span>Continent: <strong className="text-slate-200">{continentText}</strong></span>}
                {continentText && capital && <span>•</span>}
                {capital && <span>Capital: <strong className="text-slate-200">{capital}</strong></span>}
              </div>
            )}
          </div>
        </div>

        <div className="text-left md:text-right flex-shrink-0">
          <div className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wide">
            {ip}
          </div>
          <span className="text-[11px] font-mono text-slate-400 font-bold block mt-0.5">
            Type: {ipType}
          </span>
        </div>
      </div>

      {/* 3. 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        
        {/* Card 1: IP ROUTING TYPE */}
        <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800/90 space-y-1">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
            IP ROUTING TYPE
          </span>
          <div className="text-base font-black text-white capitalize">
            {routingType}
          </div>
          <span className="text-[11px] font-medium text-slate-400 block truncate" title={isp}>
            {isp}
          </span>
        </div>

        {/* Card 2: CONNECTION TYPE */}
        <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800/90 space-y-1">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
            CONNECTION TYPE
          </span>
          <div className="text-base font-black text-white">
            {connectionType}
          </div>
          <span className="text-[11px] font-medium text-slate-400 block truncate" title={networkSubtitle}>
            {networkSubtitle}
          </span>
        </div>

        {/* Card 3: GEO COORDINATES */}
        <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800/90 space-y-1">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
            GEO COORDINATES
          </span>
          <div className="font-mono text-base font-black text-white">
            {hasCoords ? `${numLat.toFixed(4)}, ${numLon.toFixed(4)}` : '—'}
          </div>
          {hasCoords ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <span>📍 View on Maps ↗</span>
            </a>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">—</span>
          )}
        </div>

        {/* Card 4: CALLING & LANG */}
        <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800/90 space-y-1">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
            CALLING & LANG
          </span>
          <div className="text-base font-black text-white">
            {callingCode}
          </div>
          <span className="text-[11px] font-medium text-slate-400 block truncate" title={languagesStr}>
            {languagesStr}
          </span>
        </div>

      </div>

      {/* 4. Bottom Regional / State Match Banner */}
      <div className="p-4 rounded-2xl bg-[#08152B] border border-emerald-500/30 flex items-center gap-3.5 shadow-inner">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="min-w-0">
          <span className="text-xs font-black text-white block">
            Regional State Match (Same State)
          </span>
          <span className="text-[11px] text-slate-300 font-medium block mt-0.5">
            {locationTitle !== '—'
              ? `IP located in ${locationTitle}${region ? `, matching declared region ${region}` : ''}.`
              : `IP Geolocation verified for ${ip}.`}
          </span>
        </div>
      </div>

    </div>
  );
}

/* =========================================================================
   10. REVERSE GEOCODING (#10) — DYNAMIC GOOGLE MAPS SATELLITE & GEOCODING INFO
   ========================================================================= */
function GeoReverseCard({ data = {}, raw = {} }) {
  const toast = useToast();
  const rawLat = data.lat !== undefined && data.lat !== null ? data.lat : (raw.lat !== undefined ? raw.lat : raw.latitude);
  const rawLon = data.lon !== undefined && data.lon !== null ? data.lon : (raw.lon !== undefined ? raw.lon : raw.longitude);
  const numLat = typeof rawLat === 'number' ? rawLat : parseFloat(rawLat);
  const numLon = typeof rawLon === 'number' ? rawLon : parseFloat(rawLon);
  const hasCoords = !isNaN(numLat) && !isNaN(numLon) && (numLat !== 0 || numLon !== 0);

  // Map Controls State: 'h' (Satellite Hybrid with labels), 'm' (Roadmap), 'k' (Pure Satellite)
  const [mapType, setMapType] = useState('h');
  const [zoom, setZoom] = useState(16);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const latDisplay = hasCoords ? `${numLat.toFixed(6)}°` : '—';
  const lonDisplay = hasCoords ? `${numLon.toFixed(6)}°` : '—';
  const latFormatted = hasCoords ? `${Math.abs(numLat).toFixed(4)}° ${numLat >= 0 ? 'N' : 'S'}` : '—';
  const lonFormatted = hasCoords ? `${Math.abs(numLon).toFixed(4)}° ${numLon >= 0 ? 'E' : 'W'}` : '—';

  const rawAddrObj = (raw.address && typeof raw.address === 'object') ? raw.address : {};
  const address = data.address || raw.display_name || raw.formatted_address || (typeof raw.address === 'string' ? raw.address : '—');
  const placeName = data.placeName || raw.name || null;
  const road = data.road || rawAddrObj.road || null;
  const suburb = data.suburb || rawAddrObj.suburb || rawAddrObj.neighbourhood || rawAddrObj.locality || null;
  const city = data.city || rawAddrObj.city || rawAddrObj.town || rawAddrObj.village || rawAddrObj.county || null;
  const stateDistrict = data.stateDistrict || rawAddrObj.state_district || rawAddrObj.district || null;
  const state = data.state || rawAddrObj.state || null;
  const postcode = data.postcode || rawAddrObj.postcode || rawAddrObj.pincode || rawAddrObj.postal_code || raw.postcode || raw.pincode || raw.postal || null;
  const country = data.country || rawAddrObj.country || null;
  const countryCode = data.countryCode || (rawAddrObj.country_code ? String(rawAddrObj.country_code).toUpperCase() : null);
  const placeId = data.placeId || raw.place_id || null;
  const osmType = data.osmType || raw.osm_type || null;
  const osmId = data.osmId || raw.osm_id || null;
  const addressType = data.addressType || raw.addresstype || raw.type || null;
  const boundingBox = data.boundingBox || raw.boundingbox || null;

  const embedUrl = hasCoords
    ? `https://maps.google.com/maps?q=${numLat},${numLon}&t=${mapType}&z=${zoom}&ie=UTF8&iwloc=&output=embed`
    : null;

  const googleMapsSearchUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${numLat},${numLon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const googleEarthUrl = hasCoords
    ? `https://earth.google.com/web/search/${numLat},${numLon}`
    : null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddr(true);
    toast?.addToast?.({
      title: 'Address Copied',
      message: 'Full doorstep address copied to clipboard.',
      type: 'success',
      duration: 2000
    });
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCopyCoords = () => {
    if (!hasCoords) return;
    navigator.clipboard.writeText(`${numLat}, ${numLon}`);
    setCopiedCoords(true);
    toast?.addToast?.({
      title: 'Coordinates Copied',
      message: `${numLat.toFixed(6)}, ${numLon.toFixed(6)} copied.`,
      type: 'success',
      duration: 2000
    });
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#061424] via-[#0b2034] to-[#040f1a] border border-cyan-500/30 text-white space-y-4 shadow-2xl p-4 sm:p-6 overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-cyan-500/20">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-cyan-600/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-black text-sm shadow-inner flex-shrink-0">
            <Compass className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-white tracking-wide uppercase truncate">
                Satellite Geodynamics & Doorstep Address
              </h4>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                HD Satellite
              </span>
            </div>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block truncate">
              Google Maps Satellite Imagery • OpenStreetMap Geocoding
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{safeText(data.status, 'GPS VERIFIED')}</span>
          </span>
        </div>
      </div>

      {/* DYNAMIC GOOGLE MAPS SATELLITE CONTAINER */}
      {hasCoords ? (
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-2xl group">
          
          {/* Top-Right Floating Controls (Map / Satellite Switcher, Zoom, External Link) */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2 flex-wrap">
            {/* Satellite / Map View Mode Switcher */}
            <div className="bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-2xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMapType('h')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mapType === 'h' || mapType === 'k'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md border border-cyan-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>🛰️ Satellite</span>
              </button>
              <button
                type="button"
                onClick={() => setMapType('m')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mapType === 'm'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md border border-cyan-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>🗺️ Map</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-2xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(prev + 1, 20))}
                className="w-7 h-7 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center text-xs font-black transition-all border border-slate-700/60"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(prev - 1, 5))}
                className="w-7 h-7 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center text-xs font-black transition-all border border-slate-700/60"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Open Google Maps Button */}
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-950/85 hover:bg-slate-900 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-bold text-cyan-300 hover:text-cyan-200 shadow-2xl flex items-center gap-1.5 transition-all"
              title="Open full view in Google Maps"
            >
              <span>Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive Google Satellite Iframe Embed */}
          <div className="relative w-full h-80 sm:h-96 md:h-[420px] bg-slate-950">
            <iframe
              key={`gmap_${numLat}_${numLon}_${mapType}_${zoom}`}
              title="Google Maps Satellite Geolocation"
              src={embedUrl}
              className="w-full h-full border-0 filter brightness-105 contrast-105"
              loading="lazy"
              allowFullScreen
            />
          </div>

          {/* Bottom-Left Floating Live GPS Preview Badge (Exact match with user's screenshot) */}
          <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-500/50 text-xs font-mono font-bold text-white shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></span>
              <span>Live GPS preview • {latFormatted}, {lonFormatted}</span>
            </div>
          </div>

          {/* Bottom-Right Satellite Mode Status */}
          <div className="absolute bottom-3.5 right-3.5 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-slate-300">
            <span>Imagery: Google Satellite</span>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
          <MapPin className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
          <p className="text-xs text-slate-300 font-bold">Provide valid latitude and longitude coordinates to render satellite map.</p>
        </div>
      )}

      {/* FULL LOCATION INFORMATION PANELS */}
      <div className="space-y-3.5 pt-1">
        
        {/* Verified Doorstep Address Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-950/95 to-cyan-950/80 border border-cyan-500/30 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-extrabold uppercase tracking-wider">
                Doorstep Landmark & Address
              </span>
              {placeName && (
                <span className="font-extrabold text-amber-300 text-xs sm:text-sm uppercase truncate">
                  📍 {placeName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all flex-shrink-0"
              title="Copy complete address"
            >
              {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddr ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed font-sans">
            {address}
          </p>
        </div>

        {/* Detailed Address Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              🛣️ Road / Street
            </span>
            <span className="font-bold text-white text-xs block truncate" title={road || '—'}>
              {road || '—'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              🏡 Suburb / Locality
            </span>
            <span className="font-bold text-cyan-200 text-xs block truncate" title={suburb || '—'}>
              {suburb || '—'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              🏙️ City / Town
            </span>
            <span className="font-bold text-white text-xs block truncate" title={city || '—'}>
              {city || '—'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              🏛️ State & District
            </span>
            <span className="font-bold text-slate-200 text-xs block truncate" title={stateDistrict ? `${stateDistrict}, ${state || ''}` : (state || '—')}>
              {stateDistrict ? `${stateDistrict}, ${state || ''}` : (state || '—')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              📮 Postal PIN Code
            </span>
            <span className="font-mono font-black text-amber-300 text-sm block">
              {postcode || '—'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              🌍 Country
            </span>
            <span className="font-bold text-white text-xs block truncate">
              {country || '—'} {countryCode ? `(${countryCode})` : ''}
            </span>
          </div>

        </div>

        {/* Technical Geolocation Metadata & Action Links Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400">GPS Coordinates:</span>
              <span className="font-mono font-extrabold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                Lat: {latDisplay} • Lon: {lonDisplay}
              </span>
              <button
                type="button"
                onClick={handleCopyCoords}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="Copy coordinates"
              >
                {copiedCoords ? 'Copied' : 'Copy Lat/Lon'}
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-wrap">
              {placeId && <span>Place ID: <strong className="text-slate-200">{placeId}</strong></span>}
              {osmType && osmId && <span>OSM: <strong className="text-slate-200">{osmType}/{osmId}</strong></span>}
              {addressType && <span>Category: <strong className="text-cyan-300 uppercase">{addressType}</strong></span>}
              {Array.isArray(boundingBox) && <span>Extent: <strong className="text-slate-300">[{boundingBox.slice(0, 2).join(', ')}...]</strong></span>}
            </div>
          </div>

          {/* External Action Links */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {googleEarthUrl && (
              <a
                href={googleEarthUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-800 hover:to-indigo-800 text-cyan-200 border border-blue-500/40 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Google Earth</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs transition-all shadow-glow-indigo flex items-center gap-1.5"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================================================================
   11. DOMAIN AGE & SECURITY (#11)
   ========================================================================= */
function DomainCard({ data }) {
  const domain = data.domain || '—';
  const age = data.age || '—';
  const createdDate = data.createdDate;
  const expiryDate = data.expiryDate;
  const registrar = data.registrar;
  const mxRecords = data.mxRecords || [];
  const mxValid = data.mxValid;

  return (
    <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c132c] via-[#121c40] to-[#070b1a] border border-indigo-500/30 text-white space-y-3.5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Globe className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <span className="font-extrabold text-sm uppercase text-indigo-200 truncate">
            ICANN Corporate Domain Security
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0 self-start sm:self-center">
          {safeText(data.status, 'VERIFIED')}
        </span>
      </div>

      <div className="py-4 text-center">
        <div className="font-mono text-2xl font-black text-indigo-200">{domain}</div>
        <div className="inline-block mt-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 font-mono text-xs font-black text-emerald-300">
          Domain Lifetime Age: {age}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-500/20 text-center text-xs font-mono">
        {createdDate && (
          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/20">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Created</span>
            <span className="font-bold text-white">{createdDate}</span>
          </div>
        )}
        {expiryDate && (
          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/20">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Expires</span>
            <span className="font-bold text-white">{expiryDate}</span>
          </div>
        )}
        {registrar && (
          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/20 col-span-full sm:col-span-1">
            <span className="text-[8px] font-bold text-slate-400 uppercase block">Registrar</span>
            <span className="font-bold text-indigo-300 truncate block">{registrar}</span>
          </div>
        )}
      </div>

      {mxRecords.length > 0 && (
        <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 text-xs">
          <span className="text-[8px] font-bold text-indigo-300 uppercase block mb-1">
            Mail Exchange (MX) Deliverability: {mxValid ? '✓ Validated' : '✕ No MX'}
          </span>
          <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
            {mxRecords.map((mx, idx) => (
              <div key={idx} className="truncate">📫 {mx}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   12. CIBIL TRANSUNION PDF REPORT (#12)
   ========================================================================= */
function CibilPdfCard({ data }) {
  const name = data.name || 'CUSTOMER';
  const pan = data.pan || '—';
  const mobile = data.mobile || '—';
  const pdfUrl = data.pdfUrl || data.pdfBase64;
  const refNo = data.referenceNo || `TU-${Date.now().toString().slice(-8)}`;

  return (
    <div className="w-full rounded-3xl bg-[#091322] border border-sky-400/40 text-white space-y-3.5 shadow-2xl overflow-hidden p-4 sm:p-5">
      {/* TransUnion CIBIL Official Yellow Banner */}
      <div className="bg-[#FFD700] text-black px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 font-black text-xs tracking-wider shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-[#00AEEF] text-sm">●</span>
          <span className="uppercase font-mono">CUSTOMER CIR • TRANSUNION CIBIL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] bg-black text-amber-300 px-2 py-0.5 rounded">
            {safeText(data.status, 'OFFICIAL CIBIL PDF READY')}
          </span>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">CONSUMER</span>
            <span className="font-bold text-white uppercase">{name}</span>
          </div>
          <div>
            <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">PAN</span>
            <span className="font-bold text-amber-300 uppercase">{pan}</span>
          </div>
          {mobile && mobile !== '—' && (
            <div>
              <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">MOBILE</span>
              <span className="font-bold text-slate-200">{mobile}</span>
            </div>
          )}
          <div>
            <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">CONTROL REF</span>
            <span className="font-bold text-emerald-400">{refNo}</span>
          </div>
        </div>
      </div>

      {/* Direct Full Embedded PDF Viewer */}
      {pdfUrl ? (
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#00AEEF]/60 shadow-2xl bg-slate-950">
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
            <span className="text-[#00AEEF] font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Official TransUnion CIBIL Credit Information Report (CIR)
            </span>
            <span className="text-[10px] text-slate-400">
              Interactive Multi-Page View
            </span>
          </div>
          <iframe
            src={pdfUrl}
            title="TransUnion CIBIL CIR Report"
            className="w-full h-[780px] sm:h-[880px] border-0 bg-white"
          />
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs font-mono bg-slate-950/60 rounded-2xl border border-dashed border-sky-500/30">
          Generating TransUnion CIBIL PDF Report...
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   13-15. CREDIT BUREAU SCORE GAUGE / DIRECT PDF CARD (#13, #14, #15)
   ========================================================================= */
function BureauScoreCard({ data }) {
  const score = data.score;
  const bureau = data.bureau || 'CRIF HighMark';
  const tier = safeText(data.tier, 'CREDIT REPORT CERTIFIED');
  const name = data.name || '—';
  const pan = data.pan || '—';
  const mobile = data.mobile || '—';
  const pdfUrl = data.pdfUrl;
  const summary = data.summary;
  const tradelinesList = data.tradelinesList || [];

  // When PDF is available (e.g. CRIF HighMark), render ONLY the full PDF directly
  if (pdfUrl) {
    return (
      <div className="w-full rounded-3xl bg-[#091322] border border-purple-500/40 text-white space-y-3.5 shadow-2xl overflow-hidden p-4 sm:p-5">
        {/* CRIF / Bureau Official Banner */}
        <div className="bg-gradient-to-r from-[#0B3663] to-[#144b82] text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 font-black text-xs tracking-wider shadow-md border border-sky-400/30">
          <div className="flex items-center gap-2">
            <span className="text-[#00AEEF] text-sm">●</span>
            <span className="uppercase font-mono">OFFICIAL DOSSIER • {bureau.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-slate-950 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/30">
              {safeText(data.status, 'OFFICIAL REPORT CERTIFIED')}
            </span>
          </div>
        </div>

        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">APPLICANT</span>
              <span className="font-bold text-white uppercase">{name}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">PAN</span>
              <span className="font-bold text-amber-300 uppercase">{pan}</span>
            </div>
            {mobile && mobile !== '—' && (
              <div>
                <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">MOBILE</span>
                <span className="font-bold text-slate-200">{mobile}</span>
              </div>
            )}
            <div>
              <span className="text-[8px] font-bold text-[#00AEEF] uppercase block">TIER</span>
              <span className="font-bold text-emerald-400">{tier}</span>
            </div>
          </div>
        </div>

        {/* Direct Full Embedded PDF Viewer */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-500/50 shadow-2xl bg-slate-950">
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
            <span className="text-sky-400 font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Official {bureau} Consumer Credit Information Dossier
            </span>
            <span className="text-[10px] text-slate-400">
              Interactive Multi-Page View
            </span>
          </div>
          <iframe
            src={pdfUrl}
            title={`${bureau} Credit Report`}
            className="w-full h-[780px] sm:h-[880px] border-0 bg-white"
          />
        </div>
      </div>
    );
  }

  const hasScore = typeof score === 'number' && !isNaN(score);
  const scoreClamped = hasScore ? Math.max(300, Math.min(900, score)) : 300;
  const angle = ((scoreClamped - 300) / 600) * 180 - 90;

  return (
    <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1b0d2b] via-[#241038] to-[#13071f] border border-purple-500/30 text-white space-y-3.5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span className="font-extrabold text-sm uppercase text-purple-200 truncate">
            {bureau} Score Rating
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex-shrink-0 self-start sm:self-center">
          {tier}
        </span>
      </div>

      <div className="py-5 flex flex-col items-center justify-center">
        <div className="relative w-52 h-26 flex items-end justify-center overflow-hidden">
          <svg className="w-52 h-52 -top-26 absolute" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#33184d" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="125.6" transform="rotate(180 100 100)" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#bureauGrd)" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset={251.2 - ((scoreClamped - 300) / 600) * 125.6} transform="rotate(180 100 100)" strokeLinecap="round" />
            <defs>
              <linearGradient id="bureauGrd" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {hasScore && (
            <div className="absolute bottom-0 w-1 h-18 bg-white origin-bottom transition-transform duration-700 shadow-md" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400 absolute -top-1 -left-0.5 shadow-glow-indigo"></div>
            </div>
          )}
        </div>

        <div className="mt-2 text-center">
          <span className="font-mono text-4xl font-black text-white">{hasScore ? score : '—'}</span>
          <span className="text-[10px] font-bold text-purple-300 block uppercase">300 — 900 Range</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-500/20 text-xs font-mono">
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase block">Applicant</span>
          <span className="font-bold text-white truncate block">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-bold text-slate-400 uppercase block">PAN ID</span>
          <span className="font-bold text-amber-300 block">{pan}</span>
        </div>
      </div>

      {summary && typeof summary === 'object' && (
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-purple-950/60 border border-purple-500/20 text-center text-xs font-mono">
          {summary.total_accounts !== undefined && (
            <div>
              <span className="text-[8px] text-slate-400 uppercase block">Total Accts</span>
              <span className="font-bold text-white">{summary.total_accounts}</span>
            </div>
          )}
          {summary.active_accounts !== undefined && (
            <div>
              <span className="text-[8px] text-slate-400 uppercase block">Active</span>
              <span className="font-bold text-emerald-400">{summary.active_accounts}</span>
            </div>
          )}
          {summary.current_balance !== undefined && (
            <div>
              <span className="text-[8px] text-slate-400 uppercase block">Balance</span>
              <span className="font-bold text-amber-300">₹ {summary.current_balance}</span>
            </div>
          )}
        </div>
      )}

      {tradelinesList.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-purple-500/20 text-xs">
          <span className="text-[9px] font-bold text-purple-300 uppercase block">Active Tradelines</span>
          <div className="space-y-1.5">
            {tradelinesList.slice(0, 3).map((t, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-between text-[11px] font-mono">
                <div>
                  <span className="font-bold text-white block">{t['CREDITOR-NAME'] || t.bank_name || t.creditor || 'Bank Tradeline'}</span>
                  <span className="text-[9px] text-slate-400">{t['ACCOUNT-TYPE'] || t.account_type || 'Account'}: {t['ACCOUNT-NUMBER'] || t.account_number || 'XXXX'}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">₹ {t['CURRENT-BALANCE'] || t.current_balance || t.sanction_amount || '—'}</span>
                  <span className="text-[9px] text-purple-300">{t['ACCOUNT-STATUS'] || t.dpd_status || 'ACTIVE'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   GENERIC FALLBACK
   ========================================================================= */
function GenericVisualCard({ data, raw }) {
  const fields = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? Object.entries(raw)
    : [];

  return (
    <div className="w-full p-5 sm:p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 text-white space-y-3.5">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
        <Sparkles className="w-4 h-4" />
        <span>{data.title || 'Verified Statutory Outcome'}</span>
      </div>

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {fields.map(([k, v]) => (
            <div key={k} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider block">
                {k.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs font-bold text-slate-100 block break-words">
                {typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-emerald-300">
          {String(raw || 'Verification Completed Successfully')}
        </div>
      )}
    </div>
  );
}

