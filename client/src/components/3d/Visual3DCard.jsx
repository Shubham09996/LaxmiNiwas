import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  Code2,
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
  Server
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
  const [showRawJson, setShowRawJson] = useState(false);

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
      <div className="relative bg-[#0B1020]/95 border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl overflow-hidden space-y-5">
        
        {/* Floating Aura */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full pointer-events-none blur-2xl"></div>
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full pointer-events-none blur-2xl"></div>

        {/* Card Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-800/80">
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
              onClick={() => setShowRawJson(!showRawJson)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showRawJson
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow-indigo'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showRawJson ? 'Hide Raw JSON' : 'Raw JSON'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
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

        {/* Collapsible Raw JSON Viewer */}
        <AnimatePresence>
          {showRawJson && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 shadow-2xl">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-bold text-indigo-300">
                  <span>LIVE UPSTREAM RAW JSON PAYLOAD</span>
                  <span className="font-mono text-slate-500">{gateway} • HTTP {statusCode || 200}</span>
                </div>
                <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 leading-relaxed">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAILORED VISUAL RENDERING PER API */}
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
  const matchScore = data.matchScore;
  const address = data.address;
  const mobile = data.mobile;
  const email = data.email;

  return (
    <div className="relative mx-auto max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-sky-400/40 overflow-hidden bg-gradient-to-br from-[#0e2c48] via-[#153b60] to-[#0a2034] text-slate-100 select-none space-y-4">
      {/* Background Micro Guilloche Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none"></div>

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-sky-300/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 font-serif font-black text-sm shadow-inner">
            🏛️
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-amber-300 uppercase">
              आयकर विभाग • INCOME TAX DEPARTMENT
            </div>
            <div className="text-[9px] font-bold text-sky-200 uppercase tracking-wider">
              भारत सरकार / GOVT. OF INDIA
            </div>
          </div>
        </div>

        <div className="text-right">
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
            {dob && (
              <div>
                <span className="text-[8px] font-bold text-sky-300 uppercase block font-sans">Date of Birth (DOB)</span>
                <span className="font-bold text-amber-200 block">{dob}</span>
              </div>
            )}
            {gender && (
              <div>
                <span className="text-[8px] font-bold text-sky-300 uppercase block font-sans">Gender</span>
                <span className="font-bold text-sky-100 block uppercase">{gender}</span>
              </div>
            )}
            {fatherName && (
              <div className="col-span-2">
                <span className="text-[8px] font-bold text-sky-300 uppercase block font-sans">Father's Name</span>
                <span className="font-bold text-sky-100 block uppercase truncate">{fatherName}</span>
              </div>
            )}
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
              {aadhaarLinked ? (aadhaarNumber ? `Seeded (${aadhaarNumber})` : 'Linked & Seeded') : 'Not Linked'}
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
      {(address || mobile || email) && (
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
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0c1f2e] via-[#0f2d42] to-[#081722] border border-cyan-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm uppercase text-white block">
              DigiLocker Paperless e-KYC Session
            </span>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
              UIDAI Digital Identity Gateway
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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
    <div className="relative mx-auto max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/50 overflow-hidden bg-[#fafafa] text-slate-900 select-none space-y-4">
      {/* Tricolor National Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      {/* Official Header */}
      <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🏛️</span>
          <div>
            <div className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
              भारत सरकार / Government of India
            </div>
            <div className="text-[8px] font-bold text-slate-600 uppercase tracking-wider">
              भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl shadow-sm">
          <Fingerprint className="w-3.5 h-3.5 text-red-600" />
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
    <div className="relative mx-auto max-w-xl rounded-2xl p-6 sm:p-7 shadow-2xl border border-indigo-400/30 overflow-hidden bg-gradient-to-br from-[#0c1b33] via-[#102a4e] to-[#081326] text-white select-none">
      <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black tracking-wide text-white block uppercase">
              {bankName}
            </span>
            <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider block">
              CORE BANKING SYSTEM (CBS)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
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
    <div className="relative mx-auto max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-indigo-500/30 overflow-hidden bg-gradient-to-br from-[#0c1630] via-[#101e44] to-[#080f22] text-white space-y-4">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-black text-sm shadow-inner">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
              {bankName}
            </h4>
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
              RBI Central IFSC Registry • {branch}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">IFSC Code</span>
          <span className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider">
            {ifsc}
          </span>
        </div>
      </div>

      {/* Address & Branch Info */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2 text-xs">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            Branch Postal Address:
          </span>
          <span className="font-medium text-slate-200 leading-relaxed block">
            {address}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 font-mono text-[11px]">
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
              <span className="font-bold text-emerald-300 block flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {contact}
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
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#062422] via-[#0b3d39] to-[#041a18] border border-teal-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-teal-400/20">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-teal-300" />
          <span className="font-extrabold text-sm uppercase text-teal-200">
            EPFO Universal Account Number Lookup
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#062422] via-[#0b3d39] to-[#041a18] border border-teal-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-teal-400/20">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-teal-300" />
          <span className="font-extrabold text-sm uppercase text-teal-200">
            EPFO Passbook Service Record
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#2b0c0c] via-[#3a1212] to-[#1c0808] border border-red-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-red-500/20">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-red-400" />
          <span className="font-extrabold text-sm uppercase text-red-200">
            Telecom Subscriber Profile & Prefill
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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
   9. IP FRAUD & GEOLOCATION RISK (#09) — FULL RESPONSE RENDERER
   ========================================================================= */
function IpFraudCard({ data }) {
  const ip = data.ip || '—';
  const ipType = data.ipType || 'IPv4';
  const continent = data.continent || '—';
  const country = data.country || '—';
  const region = data.region || '—';
  const city = data.city || '—';
  const zip = data.zip || '—';
  const lat = data.latitude;
  const lon = data.longitude;
  const capital = data.capital;
  const flagEmoji = data.flagEmoji || '🇮🇳';
  const flagUrl = data.flagUrl;
  const callingCode = data.callingCode || '+91';
  const routingType = data.routingType || 'fixed';
  const connectionType = data.connectionType || 'tx';
  const languages = data.languages || [];
  const isp = data.isp;
  const asn = data.asn;
  const riskScore = safeText(data.riskScore, '0 / 100');
  const vpn = data.vpn || 'Clean Residential IP';

  return (
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#071a26] via-[#0d283b] to-[#05141e] border border-cyan-500/30 text-white space-y-4 shadow-2xl">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-black text-sm shadow-inner">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                IP Geolocation & Threat Intelligence
              </h4>
            </div>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
              Global Cyber Risk & Host Registry
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>{safeText(data.status, 'VERIFIED')}</span>
        </span>
      </div>

      {/* Main IP & Location Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-950/90 to-cyan-950/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div>
          <span className="text-[9px] font-bold text-cyan-300 uppercase tracking-wider block mb-1">
            Inspected IP Address ({ipType.toUpperCase()})
          </span>
          <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <span>{ip}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-400/40 text-cyan-200">
              {routingType}
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right flex items-center sm:flex-col gap-2 sm:gap-1">
          <div className="flex items-center gap-1.5 text-lg">
            <span>{flagEmoji}</span>
            {flagUrl && (
              <img src={flagUrl} alt="flag" className="w-5 h-3.5 object-cover rounded shadow-sm inline-block" />
            )}
            <span className="font-black text-sm text-white">{country}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{continent}</span>
        </div>
      </div>

      {/* Detailed Geolocation Grid (City, Region, Capital, Coordinates, Zip) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/20">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">City & State</span>
          <span className="font-extrabold text-white text-xs block truncate">{city}, {region}</span>
          {zip && <span className="text-[9px] font-mono text-cyan-300">Postal: {zip}</span>}
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/20">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">GPS Coordinates</span>
          <span className="font-mono font-extrabold text-amber-300 text-xs block">
            {lat !== undefined && lon !== undefined ? `${lat}° N, ${lon}° E` : '—'}
          </span>
          <span className="text-[9px] text-slate-400">Doorstep Precision</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/20 col-span-2 sm:col-span-1">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Capital & ISD</span>
          <span className="font-bold text-white text-xs block">{capital || 'New Delhi'}</span>
          <span className="text-[9px] font-mono text-emerald-400">Calling: {callingCode}</span>
        </div>

      </div>

      {/* Network, Languages & Threat Evaluation */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 space-y-2.5 text-xs">
        
        {/* Languages */}
        {languages.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Languages className="w-3 h-3 text-cyan-400" />
              <span>Official Languages:</span>
            </span>
            {languages.map((l, i) => (
              <span key={i} className="px-2 py-0.5 rounded-lg bg-cyan-950/90 border border-cyan-500/30 text-cyan-200 text-[10px] font-mono font-bold">
                {l}
              </span>
            ))}
          </div>
        )}

        {/* ISP / ASN */}
        {isp && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase block">ISP / Autonomous System</span>
              <span className="font-bold text-slate-200 text-xs">{isp} {asn ? `(ASN: ${asn})` : ''}</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Type: {connectionType}
            </span>
          </div>
        )}

        {/* Risk & Proxy Badges */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Security Risk Score</span>
              <span className="font-mono font-black text-emerald-300 text-xs">{riskScore}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Proxy / VPN Detection</span>
              <span className="font-bold text-cyan-200 text-xs truncate block">{vpn}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================================================================
   10. REVERSE GEOCODING (#10)
   ========================================================================= */
function GeoReverseCard({ data }) {
  const lat = data.lat !== undefined ? data.lat : '—';
  const lon = data.lon !== undefined ? data.lon : '—';
  const address = data.address || '—';
  const road = data.road;
  const city = data.city;
  const state = data.state;
  const postcode = data.postcode;
  const country = data.country;

  return (
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#071a26] via-[#0d283b] to-[#05141e] border border-cyan-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span className="font-extrabold text-sm uppercase text-cyan-200">
            GPS Doorstep Geocoding
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
          {safeText(data.status, 'GPS VERIFIED')}
        </span>
      </div>

      <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-black inline-block">
        📍 {typeof lat === 'number' ? `${lat.toFixed(4)}° N` : lat}, {typeof lon === 'number' ? `${lon.toFixed(4)}° E` : lon}
      </div>

      <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/20 text-xs leading-relaxed space-y-2">
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Reverse Geocoded Doorstep Address:
          </span>
          <span className="font-medium text-slate-100 block">{address}</span>
        </div>

        {(road || city || state || postcode || country) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-cyan-500/20 font-mono text-[11px]">
            {road && <div><span className="text-[8px] text-slate-500 block">Road</span><span className="text-white">{road}</span></div>}
            {city && <div><span className="text-[8px] text-slate-500 block">City</span><span className="text-white">{city}</span></div>}
            {state && <div><span className="text-[8px] text-slate-500 block">State</span><span className="text-white">{state}</span></div>}
            {postcode && <div><span className="text-[8px] text-slate-500 block">Postal Pin</span><span className="text-amber-300">{postcode}</span></div>}
            {country && <div><span className="text-[8px] text-slate-500 block">Country</span><span className="text-white">{country}</span></div>}
          </div>
        )}
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
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0c132c] via-[#121c40] to-[#070b1a] border border-indigo-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <span className="font-extrabold text-sm uppercase text-indigo-200">
            ICANN Corporate Domain Security
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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
  const name = data.name || '—';
  const pan = data.pan || '—';
  const pdfUrl = data.pdfUrl;
  const refNo = data.referenceNo;
  const generatedAt = data.generatedAt;

  return (
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1b0d2b] via-[#241038] to-[#13071f] border border-purple-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="font-extrabold text-sm uppercase text-purple-200">
            TransUnion CIBIL Bureau PDF File
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
          {safeText(data.status, 'REPORT READY')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 py-2 text-xs">
        <div>
          <span className="text-[8px] font-bold text-purple-300 uppercase block">Applicant Name</span>
          <span className="font-extrabold text-white text-sm block uppercase truncate">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-bold text-purple-300 uppercase block">Applicant PAN</span>
          <span className="font-mono font-bold text-amber-300 text-sm block">{pan}</span>
        </div>
      </div>

      {refNo && (
        <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/20 font-mono text-[11px] text-slate-300 flex items-center justify-between">
          <span>TU Ref: <strong className="text-white">{refNo}</strong></span>
          <span>{generatedAt ? new Date(generatedAt).toLocaleDateString() : ''}</span>
        </div>
      )}

      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-glow-indigo flex items-center justify-center gap-2 transition-all group"
        >
          <Download className="w-4 h-4" />
          <span>Download Encrypted TransUnion CIBIL PDF Report</span>
        </a>
      )}
    </div>
  );
}

/* =========================================================================
   13-15. CREDIT BUREAU SCORE GAUGE (#13, #14, #15)
   ========================================================================= */
function BureauScoreCard({ data }) {
  const score = data.score;
  const bureau = data.bureau || 'Credit Bureau';
  const tier = safeText(data.tier, 'CREDIT REPORT CERTIFIED');
  const name = data.name || '—';
  const pan = data.pan || '—';
  const summary = data.summary;
  const tradelinesList = data.tradelinesList || [];

  const hasScore = typeof score === 'number' && !isNaN(score);
  const scoreClamped = hasScore ? Math.max(300, Math.min(900, score)) : 300;
  const angle = ((scoreClamped - 300) / 600) * 180 - 90;

  return (
    <div className="mx-auto max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1b0d2b] via-[#241038] to-[#13071f] border border-purple-500/30 text-white space-y-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="font-extrabold text-sm uppercase text-purple-200">
            {bureau} Score Rating
          </span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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
  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 text-white space-y-3">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
        <Sparkles className="w-4 h-4" />
        <span>{data.title || 'Verified Statutory Outcome'}</span>
      </div>
      <pre className="text-xs font-mono text-emerald-400 bg-slate-900 p-3 rounded-xl overflow-x-auto">
        {JSON.stringify(raw, null, 2)}
      </pre>
    </div>
  );
}
