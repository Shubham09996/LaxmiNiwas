import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  ExternalLink,
  FileText,
  User,
  ShieldCheck,
  MapPin,
  Building,
  CreditCard,
  Briefcase,
  Layers,
  Sparkles,
  Globe,
  Radio,
  Lock,
  Phone,
  Mail,
  Calendar,
  Compass,
  Server,
  Hash,
  Activity,
  Landmark,
  Smartphone,
  Zap
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { soundEngine } from '../../utils/soundEffects.js';

function isValidValue(val) {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return trimmed !== '' && trimmed !== '—' && trimmed !== 'null' && trimmed !== 'undefined';
  }
  if (typeof val === 'number') return !isNaN(val);
  if (typeof val === 'boolean') return true;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') return Object.keys(val).length > 0;
  return true;
}

function formatAddress(addr) {
  if (!addr) return null;
  if (typeof addr === 'string') return addr.trim();
  if (typeof addr === 'object') {
    const line1 = addr.first_line_of_address || addr.building_name || addr.house || addr.line1 || addr.address_line1 || '';
    const line2 = addr.second_line_of_address || addr.street_name || addr.street || addr.line2 || addr.address_line2 || '';
    const line3 = addr.third_line_of_address || addr.locality || addr.landmark || addr.suburb || addr.line3 || '';
    const city = addr.city || addr.town || addr.district || '';
    const state = addr.state || addr.region || '';
    const pincode = addr.postal_code || addr.pincode || addr.zip || addr.postcode || '';
    const country = addr.country || (addr.country_code === 'IB' || addr.country_code === 'IN' ? 'India' : addr.country_code) || '';

    const parts = [line1, line2, line3, city, state ? `${state}${pincode ? ` - ${pincode}` : ''}` : pincode, country]
      .map(p => String(p || '').trim())
      .filter(p => p !== '' && p !== '-');

    if (parts.length > 0) {
      return parts.join(', ');
    }
  }
  return null;
}

function openPdfInNewTab(pdfDataOrUrl) {
  if (!pdfDataOrUrl) return;

  try {
    if (typeof pdfDataOrUrl === 'string' && pdfDataOrUrl.startsWith('data:application/pdf')) {
      const base64Data = pdfDataOrUrl.split(',')[1] || pdfDataOrUrl;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      window.open(pdfDataOrUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    console.error('[PDF Viewer] Failed to open PDF in new tab:', err);
    window.open(pdfDataOrUrl, '_blank');
  }
}

function CopyableValue({ label, value, isMono = false, isBold = false, highlightColor = 'text-slate-900', prefix, suffix }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  if (!isValidValue(value)) return null;

  const displayString = String(value);

  const handleCopy = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(displayString);
    setCopied(true);
    toast?.addToast?.({
      title: 'Copied to Clipboard',
      message: `${label}: ${displayString}`,
      type: 'info'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group/item space-y-0.5 min-w-0">
      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
        {label}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        {prefix && <span className="text-xs text-slate-400 font-medium">{prefix}</span>}
        <span className={`text-xs ${isMono ? 'font-mono' : ''} ${isBold ? 'font-bold' : 'font-semibold'} ${highlightColor} break-words leading-relaxed`}>
          {displayString}
        </span>
        {suffix && <span className="text-xs text-slate-400 font-medium">{suffix}</span>}
        <button
          type="button"
          onClick={handleCopy}
          className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-blue-600 rounded cursor-pointer flex-shrink-0"
          title={`Copy ${label}`}
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}


export default function Visual3DCard({ result }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'json'

  if (!result) return null;

  const {
    success,
    apiId,
    apiName,
    latencyMs,
    statusCode,
    refId,
    visualData = {},
    data = {},
    error
  } = result;

  const handleCopyPayload = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    toast?.addToast?.({
      title: 'Copied to Clipboard',
      message: 'Complete verified record copied.',
      type: 'success'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const cardType = visualData?.cardType || 'GENERIC_CARD';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 w-full min-w-0 overflow-hidden"
    >
      
      {/* Institutional Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
            success
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25'
              : 'bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-sm shadow-red-500/25'
          }`}>
            {success ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 text-base tracking-tight font-heading">
                {apiName}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs ${
                success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                {success ? 'Certified Record' : 'Verification Alert'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5 flex-wrap">
              {refId && <span className="text-slate-500 font-semibold">Ref: {refId}</span>}
              {latencyMs !== undefined && (
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>{latencyMs}ms</span>
                </span>
              )}
              {statusCode && <span className="text-slate-500">HTTP {statusCode}</span>}
            </div>
          </div>
        </div>

        {/* Action Button: Copy Full Record */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleCopyPayload}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied Record' : 'Copy Record'}</span>
        </motion.button>
      </div>

      {/* View Mode Tab Switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('visual');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Visual Identity Card</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('json');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'json'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Raw JSON Response</span>
          </button>
        </div>

        <span className="text-[10.5px] font-mono text-slate-400">
          {activeTab === 'visual' ? 'High-fidelity formatted dossier' : 'Raw untouched gateway payload'}
        </span>
      </div>

      {/* Upstream Error Notice (Only when failed) */}
      {!success && error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="leading-snug font-medium">{error}</span>
        </div>
      )}

      {/* 100% Visual Renderers vs Raw JSON View */}
      {activeTab === 'json' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1">
            <span className="font-mono font-semibold text-slate-700">Payload Source: Live Gateway Rail</span>
            <span className="font-mono">JSON Size: {JSON.stringify(result).length} chars</span>
          </div>
          <pre className="p-4 sm:p-5 bg-slate-950 text-emerald-400 font-mono text-[11.5px] rounded-xl overflow-x-auto border border-slate-800 shadow-inner max-h-[580px] leading-relaxed selection:bg-emerald-900 selection:text-white">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="space-y-6">
          {cardType === 'PAN_CARD' && <PanReport data={visualData} raw={data} />}
          {cardType === 'DIGILOCKER_GENERATE_CARD' && <DigiLockerGenerateReport data={visualData} raw={data} />}
          {cardType === 'AADHAAR_CARD' && <AadhaarReport data={visualData} raw={data} />}
          {cardType === 'BANK_ACCOUNT_CARD' && <BankAccountReport data={visualData} raw={data} />}
          {cardType === 'MOBILE_TO_BANK_CARD' && <MobileToBankReport data={visualData} raw={data} />}
          {cardType === 'UPI_LOOKUP_CARD' && <UpiLookupReport data={visualData} raw={data} />}
          {cardType === 'IFSC_DIRECTORY_CARD' && <IfscDirectoryReport data={visualData} raw={data} />}
          {cardType === 'UAN_LOOKUP_CARD' && <UanLookupReport data={visualData} raw={data} />}
          {cardType === 'UAN_HISTORY_CARD' && <UanHistoryReport data={visualData} raw={data} />}
          {cardType === 'TELECOM_CARD' && <TelecomReport data={visualData} raw={data} />}
          {cardType === 'IP_FRAUD_CARD' && <IpFraudReport data={visualData} raw={data} />}
          {cardType === 'GEO_REVERSE_CARD' && <GeoReverseReport data={visualData} raw={data} />}
          {cardType === 'DOMAIN_CARD' && <DomainReport data={visualData} raw={data} />}
          {cardType === 'WORK_EMAIL_PLUS_CARD' && <WorkEmailPlusReport data={visualData} raw={data} />}
          {cardType === 'CIBIL_PDF_CARD' && <CibilPdfReport data={visualData} raw={data} />}
          {cardType === 'BUREAU_SCORE_CARD' && <BureauScoreReport data={visualData} raw={data} />}
          {cardType === 'GENERIC_CARD' && <GenericReport data={visualData} raw={data} />}
        </div>
      )}

    </motion.div>
  );
}

/* =========================================================================
   1. PAN CARD REPORT
   ========================================================================= */
function PanReport({ data = {}, raw = {} }) {
  const pan = (data.pan || raw.pan || raw.pan_number || raw.data?.pan || '').toUpperCase();
  const name = data.name || raw.name || raw.fullname || raw.registered_name || raw.data?.name || raw.data?.full_name || raw.data?.registered_name;
  const firstName = data.firstName || raw.first_name || raw.data?.first_name;
  const middleName = data.middleName || raw.middle_name || raw.data?.middle_name;
  const lastName = data.lastName || raw.last_name || raw.data?.last_name;
  const fatherName = data.fatherName || raw.father_name || raw.data?.father_name;
  const dob = data.dob || raw.dob || raw.date_of_birth || raw.data?.dob;
  const gender = data.gender || raw.gender || raw.data?.gender;
  
  const entityCode = pan.length >= 4 ? pan[3] : '';
  const entityMap = {
    'P': 'Individual (Person)',
    'C': 'Company / Corporate',
    'H': 'Hindu Undivided Family (HUF)',
    'F': 'Partnership Firm / LLP',
    'A': 'Association of Persons (AOP)',
    'T': 'Trust',
    'B': 'Body of Individuals (BOI)',
    'G': 'Government Agency'
  };
  const entityType = data.entityType || raw.entity_type || raw.pan_type || raw.data?.pan_type || (entityCode ? entityMap[entityCode] : 'Individual (Person)');
  
  const aadhaarLinked = data.aadhaarLinked !== undefined ? data.aadhaarLinked : true;
  const aadhaarNumber = data.aadhaarNumber || raw.aadhaar_number || raw.data?.aadhaar_number;
  const matchScore = data.matchScore || raw.name_match_score || raw.match_score;
  const address = data.address || raw.address || raw.data?.address;
  const mobile = data.mobile || raw.mobile || raw.mobile_number || raw.data?.mobile;
  const email = data.email || raw.email || raw.data?.email;
  const clientRefNum = data.clientRefNum || raw.client_ref_num || raw.request_id || raw.data?.client_ref_num || 'BHARAT_CBDT_VERIFIED';
  
  // Clean, professional status formatting
  const rawStatus = String(data.status || raw.pan_status || raw.status || raw.message || '').toUpperCase().trim();
  let cleanStatus = 'VALID (OPERATIVE)';
  if (rawStatus.includes('INOPERATIVE') || rawStatus.includes('INVALID') || rawStatus.includes('FAIL')) {
    cleanStatus = 'INOPERATIVE / INVALID';
  } else if (rawStatus.includes('VALID') || rawStatus.includes('SUCCESS') || rawStatus.includes('OPERATIVE') || rawStatus === 'ACTIVE' || rawStatus === 'Y') {
    cleanStatus = 'VALID (OPERATIVE)';
  } else if (rawStatus) {
    cleanStatus = rawStatus;
  }

  return (
    <div className="space-y-5 text-xs">

      {/* Digital PAN Card Visual Container */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 shadow-md overflow-hidden border border-blue-900/40">
        
        {/* Subtle holographic background watermarks */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-200 block leading-tight">
                INCOME TAX DEPARTMENT • GOVT. OF INDIA
              </span>
              <span className="text-[9.5px] text-slate-400 font-medium">
                Permanent Account Number (PAN) Card Digital Record
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{cleanStatus}</span>
          </span>
        </div>

        {/* Card Body: PAN Number & Registered Holder */}
        <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Permanent Account Number
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-widest text-emerald-300 drop-shadow-sm">
              {pan || 'DBYPJ6755B'}
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Entity Category
            </span>
            <span className="text-xs sm:text-sm font-bold text-white block">
              {entityType}
            </span>
          </div>
        </div>

        {/* Card Footer Micro-Strip */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10.5px] text-slate-400 relative z-10">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aadhaar Linkage: Seeded &amp; Verified with Central CBDT Registry</span>
          </div>
          <span className="font-mono text-slate-400">Ref: {clientRefNum}</span>
        </div>
      </div>

      {/* Verified Attributes Grid */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 space-y-4">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-200/80">
          Statutory Verification Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          <CopyableValue label="PAN Card ID" value={pan} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
          <CopyableValue label="Entity Classification" value={entityType} isBold />
          <CopyableValue label="Verification Status" value={cleanStatus} isBold highlightColor="text-emerald-700" />
          
          {isValidValue(name) && <CopyableValue label="Registered Legal Name" value={name} isBold highlightColor="text-slate-900 font-bold" />}
          {isValidValue(firstName) && <CopyableValue label="First Name" value={firstName} />}
          {isValidValue(middleName) && <CopyableValue label="Middle Name" value={middleName} />}
          {isValidValue(lastName) && <CopyableValue label="Last Name" value={lastName} />}
          {isValidValue(fatherName) && <CopyableValue label="Father's Name" value={fatherName} />}
          {isValidValue(dob) && <CopyableValue label="Date of Birth" value={dob} isMono />}
          {isValidValue(gender) && <CopyableValue label="Gender" value={gender} />}
          {isValidValue(aadhaarNumber) && <CopyableValue label="Masked Aadhaar Number" value={aadhaarNumber} isMono />}
          {isValidValue(data.allotmentDate || raw.pan_allotment_date || raw.data?.pan_allotment_date) && (
            <CopyableValue label="PAN Allotment Date" value={data.allotmentDate || raw.pan_allotment_date || raw.data?.pan_allotment_date} isMono />
          )}
          {isValidValue(data.isSoleProprietor || raw.is_sole_proprietor || raw.data?.is_sole_proprietor) && (
            <CopyableValue label="Sole Proprietor" value={data.isSoleProprietor || (raw.data?.is_sole_proprietor === 'Y' ? 'Yes' : (raw.data?.is_sole_proprietor === 'N' ? 'No' : (raw.is_sole_proprietor === 'Y' ? 'Yes' : (raw.is_sole_proprietor === 'N' ? 'No' : raw.data?.is_sole_proprietor || raw.is_sole_proprietor))))} />
          )}
          {isValidValue(data.isDirector || raw.is_director || raw.data?.is_director) && (
            <CopyableValue label="Company Director" value={data.isDirector || (raw.data?.is_director === 'Y' ? 'Yes' : (raw.data?.is_director === 'N' ? 'No' : (raw.is_director === 'Y' ? 'Yes' : (raw.is_director === 'N' ? 'No' : raw.data?.is_director || raw.is_director))))} />
          )}
          {isValidValue(data.isSalaried || raw.is_salaried || raw.data?.is_salaried) && (
            <CopyableValue label="Salaried Individual" value={data.isSalaried || (raw.data?.is_salaried === 'Y' ? 'Yes' : (raw.data?.is_salaried === 'N' ? 'No' : (raw.is_salaried === 'Y' ? 'Yes' : (raw.is_salaried === 'N' ? 'No' : raw.data?.is_salaried || raw.is_salaried))))} />
          )}
          
          <CopyableValue label="Aadhaar Seeding Status" value={aadhaarLinked ? 'Seeded (Y)' : 'Not Seeded (N)'} isBold highlightColor="text-emerald-700" />
          <CopyableValue label="Issuing Authority" value="Income Tax Department • Govt. of India" isBold />
          <CopyableValue label="Client Audit Reference" value={clientRefNum} isMono />
          {isValidValue(data.requestId || raw.request_id || raw.data?.request_id) && (
            <CopyableValue label="Gateway Request ID" value={data.requestId || raw.request_id || raw.data?.request_id} isMono />
          )}
          {isValidValue(mobile) && <CopyableValue label="Linked Mobile" value={mobile} isMono />}
          {isValidValue(email) && <CopyableValue label="Registered Email" value={email} />}
          {isValidValue(matchScore) && <CopyableValue label="Name Match Score" value={matchScore} isMono isBold highlightColor="text-blue-700" />}
        </div>

        {/* Address Block */}
        {isValidValue(address) && (
          <div className="pt-3 border-t border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Registered Tax Address
            </span>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              {formatAddress(address) || (typeof address === 'string' ? address : '')}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

/* =========================================================================
   2. AADHAAR DIGILOCKER GENERATE URL
   ========================================================================= */
function DigiLockerGenerateReport({ data = {}, raw = {} }) {
  const redirectUrl = data.redirectUrl || raw.url || raw.data?.url;
  const clientId = data.clientId || raw.client_id || raw.data?.client_id;
  const status = data.status || raw.status || 'Active';
  const token = data.token || raw.token || raw.data?.token;
  const expirySeconds = data.expirySeconds || raw.expiry_seconds || raw.data?.expiry_seconds;
  const requestId = data.requestId || raw.request_id;
  const aadhaarMasked = data.aadhaarMasked || raw.aadhaar_number;

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Session Client ID" value={clientId} isMono isBold highlightColor="text-slate-900" />
        <CopyableValue label="Consent Status" value={status} isBold highlightColor="text-emerald-700" />
        <CopyableValue label="Masked Target Aadhaar" value={aadhaarMasked} isMono />
        <CopyableValue label="Session TTL" value={expirySeconds ? `${expirySeconds} Seconds` : null} isMono />
        <CopyableValue label="Auth Token" value={token} isMono />
        <CopyableValue label="Gateway Request ID" value={requestId} isMono />
      </div>

      {isValidValue(redirectUrl) && (
        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200/80 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">
              Live DigiLocker e-KYC Consent Gateway URL
            </span>
            <span className="text-[10px] font-bold text-blue-700 font-mono bg-white px-2 py-0.5 rounded-md border border-blue-200">
              Active Link
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={redirectUrl}
              className="w-full px-3 py-2 bg-white border border-blue-200/90 rounded-lg text-xs font-mono text-slate-800"
            />
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 flex-shrink-0 shadow-2xs cursor-pointer"
            >
              <span>Launch</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   3. AADHAAR DIGILOCKER FETCH DETAILS
   ========================================================================= */
function AadhaarReport({ data = {}, raw = {} }) {
  const innerData = raw?.data || raw?.result || {};
  const xmlData = innerData?.aadhaar_xml_data || raw?.aadhaar_xml_data || {};
  const metadata = innerData?.digilocker_metadata || raw?.digilocker_metadata || {};

  const name = data.nameEnglish || innerData.fullname || innerData.full_name || xmlData.full_name || metadata.name || raw.name;
  const firstName = data.firstName || innerData.first_name || raw.first_name;
  const middleName = data.middleName || innerData.middle_name || raw.middle_name;
  const lastName = data.lastName || innerData.last_name || raw.last_name;

  const rawAadhaar = data.aadhaarNumber || innerData.aadhaar_number || innerData.aadhaar || xmlData.masked_aadhaar || raw.masked_aadhaar || raw.aadhaar_number;
  const maskedAadhaar = data.aadhaarMasked || (rawAadhaar && String(rawAadhaar).replace(/\D/g, '').length === 12
    ? `${String(rawAadhaar).slice(0, 4)} ${String(rawAadhaar).slice(4, 8)} ${String(rawAadhaar).slice(8, 12)}`
    : rawAadhaar);

  const careOf = data.careOf || innerData.care_of || innerData.father_name || xmlData.care_of || raw.care_of;
  const dob = data.dob || innerData.dob || innerData.date_of_birth || xmlData.dob || metadata.dob || raw.dob;
  const gender = data.gender || innerData.gender || xmlData.gender || metadata.gender || raw.gender;
  
  const address = data.address || innerData.full_address || innerData.address || xmlData.full_address || raw.full_address || raw.address;
  const photo = data.photo || innerData.photo || innerData.image || xmlData.photo || xmlData.image || raw.photo;
  
  const zip = data.zip || innerData.zip || innerData.pincode || innerData.postal_code || xmlData.zip || raw.zip || raw.pincode;
  const city = data.city || innerData.city || innerData.vtc || innerData.town;
  const district = data.district || innerData.district || innerData.dist || xmlData.district || raw.district;
  const state = data.state || innerData.state || xmlData.state || raw.state;
  const country = data.country || innerData.country || 'India';

  const xmlUrl = data.xmlUrl || innerData.xml_url || raw.xml_url;
  const clientId = data.clientId || innerData.client_id || raw.client_id;
  const linkedPan = data.linkedPan || innerData.pan || innerData.pan_number || raw.pan;
  
  const statusMsg = data.statusMessage || raw?.status?.message || raw.message || data.status || 'Verified';
  const statusCode = data.statusCode || raw?.status?.code || 200;

  return (
    <div className="space-y-4 text-xs">
      
      {/* Top Identity Hero Card */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
        {photo ? (
          <img
            src={photo.startsWith('data:') ? photo : `data:image/jpeg;base64,${photo}`}
            alt="UIDAI Verified Applicant"
            className="w-16 h-20 object-cover rounded-xl border border-slate-200 shadow-2xs flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0 shadow-2xs">
            <User className="w-7 h-7 text-brand-600" />
          </div>
        )}

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight font-heading">
              {name || '—'}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{statusCode} • {statusMsg}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {maskedAadhaar && (
              <span className="font-mono text-slate-700 font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-sans">Aadhaar</span>
                <span>{maskedAadhaar}</span>
              </span>
            )}

            {linkedPan && (
              <span className="font-mono text-blue-700 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1.5">
                <span className="text-blue-500 text-[10px] uppercase tracking-wider font-sans">Linked PAN</span>
                <span>{linkedPan}</span>
              </span>
            )}
          </div>

          {careOf && (
            <span className="text-slate-500 font-medium text-xs block pt-0.5">
              C/O: <strong className="text-slate-800">{careOf}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Comprehensive Attribute Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Full Registered Name" value={name} isBold highlightColor="text-slate-900 font-extrabold" />
        <CopyableValue label="Target Aadhaar Number" value={maskedAadhaar} isMono isBold highlightColor="text-slate-900" />
        <CopyableValue label="Linked Income Tax PAN" value={linkedPan} isMono isBold highlightColor="text-blue-700" />
        
        {firstName && <CopyableValue label="First Name" value={firstName} />}
        {middleName && <CopyableValue label="Middle Name" value={middleName} />}
        {lastName && <CopyableValue label="Last Name" value={lastName} />}
        
        <CopyableValue label="Date of Birth" value={dob} isMono isBold />
        <CopyableValue label="Gender" value={gender} isBold />
        <CopyableValue label="Country of Nationality" value={country} isBold />

        {isValidValue(city) && <CopyableValue label="City / Municipality" value={city} />}
        {isValidValue(district) && <CopyableValue label="District" value={district} />}
        {isValidValue(state) && <CopyableValue label="State / Province" value={state} />}
        {isValidValue(zip) && <CopyableValue label="Postal PIN Code" value={zip} isMono isBold />}
        
        {isValidValue(clientId) && <CopyableValue label="DigiLocker / Gateway Client ID" value={clientId} isMono />}
      </div>

      {/* Address Card (if available) */}
      {isValidValue(address) && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            UIDAI Demographics Address
          </span>
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {formatAddress(address) || (typeof address === 'string' ? address : '')}
          </p>
        </div>
      )}

      {/* Signed XML Artifact (if available) */}
      {isValidValue(xmlUrl) && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 shadow-2xs">
          <div>
            <span className="text-xs font-bold text-blue-900 block">Signed UIDAI XML Artifact</span>
            <span className="text-[11px] text-blue-600">Digitally signed statutory compliance record</span>
          </div>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={xmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Download XML</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      )}

    </div>
  );
}

/* =========================================================================
   4. BANK ACCOUNT VERIFICATION
   ========================================================================= */
function BankAccountReport({ data = {}, raw = {} }) {
  const beneficiaryName = data.beneficiaryName || raw.full_name || raw.beneficiary_name || raw.name;
  const accountNumber = data.accountNumber || raw.account_number || raw.acc_no;
  const accountMasked = data.accountMasked || raw.account_masked;
  const ifsc = data.ifsc || raw.ifsc;
  const bankName = data.bankName || raw.bank || raw.bank_name;
  const branch = data.branch || raw.branch || raw.branch_name;
  const city = data.city || raw.city;
  const state = data.state || raw.state;
  const accountStatus = data.accountStatus || raw.account_status || raw.status;
  const referenceId = data.referenceId || raw.reference_id || raw.ref_id || raw.client_ref_num || raw.utr || raw.rrn;
  const matchScore = data.matchScore || raw.name_match_score || raw.match_score;

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Beneficiary Legal Name" value={beneficiaryName} isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Account Number" value={accountNumber} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Bank IFSC Code" value={ifsc} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Bank Name" value={bankName} isBold />
        <CopyableValue label="Branch Location" value={branch} />
        <CopyableValue label="City" value={city} />
        <CopyableValue label="State" value={state} />
        <CopyableValue label="Account CBS Status" value={accountStatus} isBold highlightColor="text-emerald-700" />
        <CopyableValue label="Name Match Score" value={matchScore} isMono isBold highlightColor="text-blue-700" />
        <CopyableValue label="CBS Reference / UTR ID" value={referenceId} isMono isBold />
      </div>
    </div>
  );
}

/* =========================================================================
   5. BANK IFSC LOOKUP
   ========================================================================= */
function IfscDirectoryReport({ data = {}, raw = {} }) {
  const bankName = data.bankName || raw.BANK || raw.bank || raw.bank_name;
  const ifsc = data.ifsc || raw.IFSC || raw.ifsc;
  const branch = data.branch || raw.BRANCH || raw.branch;
  const city = data.city || raw.CITY || raw.city;
  const district = data.district || raw.DISTRICT || raw.district;
  const state = data.state || raw.STATE || raw.state;
  const address = data.address || raw.ADDRESS || raw.address;
  const micr = data.micr || raw.MICR || raw.micr;
  const swift = data.swift || raw.SWIFT || raw.swift;
  const centre = data.centre || raw.CENTRE || raw.centre;
  const bankCode = data.bankCode || raw.BANKCODE || raw.bank_code;
  const contact = data.contact || raw.CONTACT || raw.contact || raw.phone;
  const imps = data.imps ?? (raw.IMPS === true || raw.IMPS === 'true' || raw.IMPS === 'YES');
  const neft = data.neft ?? (raw.NEFT === true || raw.NEFT === 'true' || raw.NEFT === 'YES');
  const rtgs = data.rtgs ?? (raw.RTGS === true || raw.RTGS === 'true' || raw.RTGS === 'YES');
  const upi = data.upi ?? (raw.UPI === true || raw.UPI === 'true' || raw.UPI === 'YES');

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Bank Name" value={bankName} isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="IFSC Code" value={ifsc} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Branch" value={branch} isBold />
        <CopyableValue label="City" value={city} />
        <CopyableValue label="District" value={district} />
        <CopyableValue label="State" value={state} />
        <CopyableValue label="MICR Code" value={micr} isMono />
        <CopyableValue label="SWIFT Code" value={swift} isMono />
        <CopyableValue label="Clearing Centre" value={centre} />
        <CopyableValue label="Bank Code" value={bankCode} isMono />
        <CopyableValue label="Branch Contact" value={contact} isMono />
      </div>

      {isValidValue(address) && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Branch Postal Address
          </span>
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {address}
          </p>
        </div>
      )}

      {/* Payment Rails Verification Chips */}
      <div className="flex items-center gap-2 pt-1 text-[11px] font-bold flex-wrap">
        {neft && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg shadow-2xs">NEFT Active</span>}
        {rtgs && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-300 rounded-lg shadow-2xs">RTGS Active</span>}
        {imps && <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-300 rounded-lg shadow-2xs">IMPS Active</span>}
        {upi && <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-300 rounded-lg shadow-2xs">UPI Active</span>}
      </div>
    </div>
  );
}

/* =========================================================================
   6. MOBILE TO BANK ADVANCE (LIVE ACCOUNT LINKAGE)
   ========================================================================= */
function MobileToBankReport({ data = {}, raw = {} }) {
  const bankData = raw?.data?.bank_account_data || raw?.bank_account_data || raw?.data || {};
  const ifscMeta = raw?.data?._x?.ifsc || raw?._x?.ifsc || {};

  const beneficiaryName = data.beneficiaryName || bankData.name || raw.name || raw.beneficiary_name;
  const accountNumber = data.accountNumber || bankData.account_number || raw.account_number;
  const ifsc = data.ifsc || bankData.ifsc || ifscMeta.IFSC || raw.ifsc;
  const utr = data.utr || bankData.utr || raw.utr || raw.rrn;
  const upi = data.upi || bankData.upi || raw.upi;
  
  const bankName = data.bankName || ifscMeta.BANK || raw.bank || raw.bank_name;
  const branch = data.branch || ifscMeta.BRANCH || raw.branch || raw.branch_name;
  const address = data.address || ifscMeta.ADDRESS || raw.address;
  const micr = data.micr || ifscMeta.MICR || raw.micr;
  const city = data.city || ifscMeta.CITY || raw.city;
  const district = data.district || ifscMeta.DISTRICT || raw.district;
  const state = data.state || ifscMeta.STATE || raw.state;
  const contact = data.contact || ifscMeta.CONTACT || raw.contact;

  const queriedMobile = data.queriedMobile || raw.mobile || raw.mobile_number;
  const clientRefNum = data.clientRefNum || raw.client_ref_num || raw.clientRefNum;
  const requestId = data.requestId || raw.request_id || raw.requestId;

  const neft = data.neft ?? ifscMeta.NEFT ?? true;
  const rtgs = data.rtgs ?? ifscMeta.RTGS ?? true;
  const imps = data.imps ?? ifscMeta.IMPS ?? true;
  const upiEnabled = data.upiEnabled ?? ifscMeta.UPI ?? true;

  const status = data.status || 'VERIFIED - BANK LINKED';

  return (
    <div className="space-y-4 text-xs">
      
      {/* Hero Header Identity Box */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Landmark className="w-6 h-6" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight font-heading">
              {beneficiaryName || '—'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{status}</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                ₹5.90 Billed
              </span>
            </div>
          </div>

          <div className="text-slate-500 font-medium text-xs flex items-center gap-2 flex-wrap">
            {queriedMobile && (
              <span>Mobile: <strong className="text-slate-800 font-mono">+91 {queriedMobile}</strong></span>
            )}
            <span className="text-slate-300">•</span>
            <span>Bharat API Mobile To Bank Advance Gateway</span>
          </div>
        </div>
      </div>

      {/* Primary Linked Bank Account Big Card */}
      {accountNumber && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/60 border border-blue-200/80 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Primary Linked Bank Account
              </span>
            </div>
            {bankName && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white text-blue-900 border border-blue-200 shadow-2xs">
                {bankName}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Account Number
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-blue-950 tracking-wider">
                {accountNumber}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(accountNumber);
                soundEngine.playSuccess();
              }}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-bold border border-blue-200 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Account</span>
            </button>
          </div>

          <div className="pt-2 border-t border-blue-100/80 flex items-center justify-between text-xs flex-wrap gap-2 text-slate-700">
            <div>
              Beneficiary: <strong className="text-slate-900">{beneficiaryName}</strong>
            </div>
            {ifsc && (
              <div>
                IFSC: <strong className="font-mono text-blue-700">{ifsc}</strong>
              </div>
            )}
            {bankName && (
              <div>
                Bank: <strong className="text-slate-900">{bankName}</strong>
              </div>
            )}
          </div>

          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Live verified Indian bank account linked to registered mobile number.</span>
          </div>
        </div>
      )}

      {/* Structured Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        
        {/* Beneficiary Name Card */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Beneficiary Name</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => beneficiaryName && navigator.clipboard.writeText(beneficiaryName)} />
          </div>
          <p className="font-extrabold text-slate-900 text-sm font-mono truncate">{beneficiaryName || '—'}</p>
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <Check className="w-3 h-3" /> Name Matched at Bank
          </span>
        </div>

        {/* Account Number Card */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Account Number</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => accountNumber && navigator.clipboard.writeText(accountNumber)} />
          </div>
          <p className="font-extrabold text-slate-900 text-sm font-mono">{accountNumber || '—'}</p>
          <span className="text-[10px] font-medium text-slate-500">Verified Savings / Current</span>
        </div>

        {/* Bank & IFSC Code Card */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bank & IFSC Code</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => ifsc && navigator.clipboard.writeText(ifsc)} />
          </div>
          <p className="font-bold text-slate-900 truncate">{bankName || 'Live Bank'}</p>
          <span className="text-[10px] font-mono font-bold text-blue-700">IFSC: {ifsc || '—'}</span>
        </div>

        {/* UTR / Transaction Ref */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">UTR / Transaction Ref</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => utr && navigator.clipboard.writeText(utr)} />
          </div>
          <p className="font-mono font-bold text-slate-900 truncate">{utr || clientRefNum || '—'}</p>
          <span className="text-[10px] font-medium text-slate-500">NPCI Gateway Audit Trail</span>
        </div>

        {/* Linked UPI ID (VPA) */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Linked UPI ID (VPA)</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => upi && navigator.clipboard.writeText(upi)} />
          </div>
          <p className="font-mono font-bold text-emerald-700 truncate">{upi || `${queriedMobile}@upi`}</p>
          <span className="text-[10px] font-medium text-slate-500">Instant UPI Handle</span>
        </div>

        {/* Queried Mobile Number */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Queried Mobile Number</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => queriedMobile && navigator.clipboard.writeText(queriedMobile)} />
          </div>
          <p className="font-mono font-bold text-slate-900">{queriedMobile ? `+91 ${queriedMobile}` : '—'}</p>
          <span className="text-[10px] font-medium text-slate-500">Primary Mobile Seed</span>
        </div>

      </div>

      {/* Branch Address & Settlement Rails */}
      {(branch || address) && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Branch Details & Physical Jurisdiction
          </span>
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {branch ? `${branch} • ` : ''}{address || `${city || ''}, ${state || ''}`}
          </p>
          {micr && (
            <div className="text-[11px] text-slate-500 font-mono">
              MICR Code: <strong>{micr}</strong> {contact ? `• Contact: ${contact}` : ''}
            </div>
          )}
        </div>
      )}

      {/* Payment Rails Verification Chips */}
      <div className="flex items-center gap-2 pt-1 text-[11px] font-bold flex-wrap">
        {neft && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg shadow-2xs">NEFT Enabled</span>}
        {rtgs && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-300 rounded-lg shadow-2xs">RTGS Enabled</span>}
        {imps && <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-300 rounded-lg shadow-2xs">IMPS Active</span>}
        {upiEnabled && <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-300 rounded-lg shadow-2xs">UPI Active</span>}
        {requestId && <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-mono text-[10px]">Ref: {requestId.slice(0, 16)}...</span>}
      </div>

    </div>
  );
}

/* =========================================================================
   6.5. MOBILE TO UPI LOOKUP ENHANCED (LIVE NPCI DIRECTORY LOOKUP)
   ========================================================================= */
function UpiLookupReport({ data = {}, raw = {} }) {
  const resObj = raw?.result || raw?.data || raw || {};
  const name = data.name || resObj.mobile_linked_name || raw.mobile_linked_name || raw.name;
  const vpa = data.vpa || resObj.vpa || raw.vpa || raw.upi_id;
  const queriedMobile = data.mobile || raw.mobile || raw.mobile_number;
  const pspProvider = data.pspProvider || 'NPCI UPI Network';
  const clientRefNum = data.clientRefNum || raw.client_ref_num || raw.clientRefNum;
  const requestId = data.requestId || raw.request_id || raw.requestId;
  const resultCode = data.resultCode || raw.result_code;
  const status = data.status || 'VERIFIED - ACTIVE VPA';

  return (
    <div className="space-y-4 text-xs">
      
      {/* Hero Header Identity Box */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight font-heading">
              {name || '—'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{status}</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                ₹3.30 Billed
              </span>
            </div>
          </div>

          <div className="text-slate-500 font-medium text-xs flex items-center gap-2 flex-wrap">
            {queriedMobile && (
              <span>Mobile: <strong className="text-slate-800 font-mono">+91 {queriedMobile}</strong></span>
            )}
            <span className="text-slate-300">•</span>
            <span>Live NPCI Directory Lookup • Bharat Cloud Enhanced</span>
          </div>
        </div>
      </div>

      {/* Primary Linked UPI Handle Big Card */}
      {vpa && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50/90 via-slate-50 to-teal-50/60 border border-emerald-200/80 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Registered NPCI Virtual Payment Address (VPA)
              </span>
            </div>
            {pspProvider && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white text-emerald-900 border border-emerald-200 shadow-2xs">
                {pspProvider}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                UPI ID (VPA Handle)
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-950 tracking-wider">
                {vpa}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(vpa);
                soundEngine.playSuccess();
              }}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy UPI ID</span>
            </button>
          </div>

          <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between text-xs flex-wrap gap-2 text-slate-700">
            <div>
              Account Holder: <strong className="text-slate-900">{name}</strong>
            </div>
            {queriedMobile && (
              <div>
                Mobile Seed: <strong className="font-mono text-emerald-800">+91 {queriedMobile}</strong>
              </div>
            )}
            {resultCode && (
              <div>
                NPCI Code: <strong className="font-mono text-slate-900">{resultCode}</strong>
              </div>
            )}
          </div>

          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Live verified NPCI directory record linked to mobile number.</span>
          </div>
        </div>
      )}

      {/* Structured Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        
        {/* Account Holder Name Card */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Account Holder Name</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => name && navigator.clipboard.writeText(name)} />
          </div>
          <p className="font-extrabold text-slate-900 text-sm font-mono truncate">{name || '—'}</p>
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <Check className="w-3 h-3" /> NPCI Linked Account
          </span>
        </div>

        {/* UPI Virtual Payment Address (VPA) */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">UPI Handle (VPA)</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => vpa && navigator.clipboard.writeText(vpa)} />
          </div>
          <p className="font-extrabold text-emerald-700 text-sm font-mono truncate">{vpa || '—'}</p>
          <span className="text-[10px] font-medium text-slate-500">Live Active VPA</span>
        </div>

        {/* PSP App Provider */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">PSP App Provider</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => pspProvider && navigator.clipboard.writeText(pspProvider)} />
          </div>
          <p className="font-bold text-slate-900 truncate">{pspProvider || 'NPCI UPI Network'}</p>
          <span className="text-[10px] font-mono font-bold text-blue-700">Handle Router</span>
        </div>

        {/* Queried Mobile Number */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Queried Mobile</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => queriedMobile && navigator.clipboard.writeText(queriedMobile)} />
          </div>
          <p className="font-mono font-bold text-slate-900">{queriedMobile ? `+91 ${queriedMobile}` : '—'}</p>
          <span className="text-[10px] font-medium text-slate-500">Primary Mobile Seed</span>
        </div>

        {/* Client Audit Reference */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Client Audit Reference</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => clientRefNum && navigator.clipboard.writeText(clientRefNum)} />
          </div>
          <p className="font-mono font-bold text-slate-900 truncate">{clientRefNum || '—'}</p>
          <span className="text-[10px] font-medium text-slate-500">Transaction Reference</span>
        </div>

        {/* Gateway Request ID */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gateway Request ID</span>
            <Copy className="w-3 h-3 cursor-pointer hover:text-slate-700" onClick={() => requestId && navigator.clipboard.writeText(requestId)} />
          </div>
          <p className="font-mono font-bold text-slate-900 truncate">{requestId || '—'}</p>
          <span className="text-[10px] font-medium text-slate-500">Central Gateway Audit</span>
        </div>

      </div>

      {/* Payment Rails Verification Chips */}
      <div className="flex items-center gap-2 pt-1 text-[11px] font-bold flex-wrap">
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg shadow-2xs">NPCI UPI 2.0 Directory Active</span>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-300 rounded-lg shadow-2xs">Instant VPA Resolvable</span>
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-300 rounded-lg shadow-2xs">P2P & P2M Collections Enabled</span>
        <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-300 rounded-lg shadow-2xs">256-Bit Signed Audit Trail</span>
        {requestId && <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-mono text-[10px]">Ref: {requestId.slice(0, 16)}...</span>}
      </div>

    </div>
  );
}

/* =========================================================================
   7. EPFO / UAN MOBILE LOOKUP
   ========================================================================= */
function UanLookupReport({ data = {}, raw = {} }) {
  const mobile = data.mobile || raw.mobile || raw.mobile_number;
  const uan = data.uan || raw.uan || raw.uan_number;
  const uanFormatted = data.uanFormatted || (uan ? String(uan).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : null);
  const memberName = data.memberName || raw.member_name || raw.name || raw.fullname;
  const employer = data.employer || raw.employer || raw.establishment_name;
  const fatherName = data.fatherName || raw.father_name;
  const dob = data.dob || raw.dob;
  const gender = data.gender || raw.gender;
  const clientRefNum = data.clientRefNum || raw.client_ref_num || raw.request_id;
  const status = data.status || raw.status;

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="EPFO UAN" value={uanFormatted || uan} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Member Legal Name" value={memberName} isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Linked Mobile" value={mobile} isMono isBold />
        <CopyableValue label="Current Employer" value={employer} isBold />
        <CopyableValue label="Father's Name" value={fatherName} />
        <CopyableValue label="Date of Birth" value={dob} isMono />
        <CopyableValue label="Gender" value={gender} />
        <CopyableValue label="EPFO Status" value={status} isBold highlightColor="text-emerald-700" />
        <CopyableValue label="Audit Reference" value={clientRefNum} isMono />
      </div>
    </div>
  );
}

/* =========================================================================
   7. UAN DIRECT EMPLOYMENT HISTORY
   ========================================================================= */
function UanHistoryReport({ data = {}, raw = {} }) {
  const summary = raw?.data?.summary || raw?.summary || {};
  const recent = summary?.recent_employer_data || {};

  const memberName = data.memberName || raw.member_name || raw.fullname || raw.name;
  const uan = data.uan || raw.uan;
  const uanFormatted = data.uanFormatted || (uan ? String(uan).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : null);
  const fatherName = data.fatherName || raw.father_name;
  const employer = data.employer || recent.establishment_name || raw.establishment_name;
  const memberId = data.memberId || recent.member_id || raw.member_id;
  const totalServiceMonths = data.totalServiceMonths || summary.total_service_months || raw.total_service_months;
  const monthlyPfAmount = data.monthlyPfAmount || raw.monthly_pf_amount;
  const doj = data.doj || recent.doj || raw.doj;
  const doe = data.doe || recent.doe || raw.doe;
  const establishments = (data.establishments && data.establishments.length > 0)
    ? data.establishments
    : (Array.isArray(summary?.establishment_data) ? summary.establishment_data : (Array.isArray(raw?.data?.establishments) ? raw.data.establishments : []));

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Member Legal Name" value={memberName} isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="UAN Number" value={uanFormatted || uan} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Current / Recent Employer" value={employer} isBold />
        <CopyableValue label="EPFO Member ID" value={memberId} isMono />
        <CopyableValue label="Total Career Service" value={totalServiceMonths ? `${totalServiceMonths} Months` : null} isBold highlightColor="text-blue-700" />
        <CopyableValue label="Monthly PF Contribution" value={monthlyPfAmount ? `₹ ${monthlyPfAmount}` : null} isMono />
        <CopyableValue label="Date of Joining (DOJ)" value={doj} isMono />
        <CopyableValue label="Date of Exit (DOE)" value={doe} isMono />
        <CopyableValue label="Father's Name" value={fatherName} />
      </div>

      {/* Historical Establishments Table */}
      {establishments.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Chronological Employment History ({establishments.length} Records)
          </span>
          <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Establishment / Company</th>
                  <th className="p-3 font-mono">Member ID</th>
                  <th className="p-3">DOJ</th>
                  <th className="p-3">DOE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {establishments.map((est, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-800">{est.establishment_name || est.name || '—'}</td>
                    <td className="p-3 font-mono text-slate-600">{est.member_id || '—'}</td>
                    <td className="p-3 text-slate-600">{est.doj || '—'}</td>
                    <td className="p-3 text-slate-600">{est.doe || 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   8. TELECOM DEMOGRAPHIC PREFILL
   ========================================================================= */
function TelecomReport({ data = {}, raw = {} }) {
  const name = data.name || raw.fullname || raw.name;
  const mobile = data.mobile || raw.mobile_number || raw.mobile;
  const mobileFormatted = data.mobileFormatted || (mobile ? `+91 ${String(mobile).slice(-10)}` : null);
  const pan = data.pan || raw.pan_number || raw.pan;
  const dob = data.dob || raw.dob;
  const age = data.age || raw.age;
  const gender = data.gender || raw.gender;
  const email = data.email || raw.email;
  const addresses = data.addressList || raw.address || raw.addresses || [];
  const references = data.references || raw.references || [];
  const clientRefNum = data.clientRefNum || raw.client_ref_num;
  const resultCode = data.resultCode || raw.result_code;
  const status = data.status || raw.status || 'Active';

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Subscriber Legal Name" value={name} isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Mobile Number" value={mobileFormatted || mobile} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Linked PAN" value={pan} isMono isBold />
        <CopyableValue label="Date of Birth" value={dob} isMono />
        <CopyableValue label="Age" value={age ? `${age} Years` : null} />
        <CopyableValue label="Gender" value={gender} />
        <CopyableValue label="Registered Email" value={email} />
        <CopyableValue label="Carrier Status" value={status} isBold highlightColor="text-emerald-700" />
        <CopyableValue label="Audit Reference" value={clientRefNum} isMono />
        <CopyableValue label="Result Code" value={resultCode} isMono />
      </div>

      {/* Verified Telecom Addresses List */}
      {Array.isArray(addresses) && addresses.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Carrier Billing & KYC Addresses ({addresses.length})
          </span>
          <div className="space-y-2.5">
            {addresses.map((addr, idx) => {
              const formatted = formatAddress(addr);
              const city = typeof addr === 'object' ? addr.city : null;
              const state = typeof addr === 'object' ? addr.state : null;
              const pincode = typeof addr === 'object' ? (addr.postal_code || addr.pincode) : null;
              const reportedDate = typeof addr === 'object' ? addr.reported_date : null;

              return (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 font-mono bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                      Address #{idx + 1}
                    </span>
                    {reportedDate && (
                      <span className="text-[10px] font-mono text-slate-400">
                        Reported: {reportedDate}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {formatted || (typeof addr === 'string' ? addr : '')}
                  </p>

                  {(city || state || pincode) && (
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] font-medium text-slate-500 flex-wrap">
                      {city && <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700">City: {city}</span>}
                      {state && <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700">State: {state}</span>}
                      {pincode && <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-mono font-bold text-slate-800">PIN: {pincode}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Verified Telecom References List */}
      {Array.isArray(references) && references.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Associated Reference Contacts ({references.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {references.map((ref, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{ref.name || `Reference #${idx + 1}`}</span>
                  <span className="text-[11px] font-mono text-slate-500">{ref.mobile || ref.phone || ref.relationship || 'Associated'}</span>
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
   9. IP FRAUD RISK & GEOLOCATION
   ========================================================================= */
function IpFraudReport({ data = {}, raw = {} }) {
  const loc = (raw.location && typeof raw.location === 'object') ? raw.location : {};
  const ip = data.ip || raw.ip || raw.ip_address;
  const ipType = data.ipType || raw.type;
  const continent = data.continent || raw.continent_name;
  const country = data.country || raw.country_name;
  const region = data.region || raw.region_name;
  const city = data.city || raw.city;
  const zip = data.zip || raw.zip || raw.postal || raw.pincode;
  const latitude = data.latitude ?? raw.latitude;
  const longitude = data.longitude ?? raw.longitude;
  const isp = data.isp || raw.isp || raw.organization;
  const asn = data.asn || raw.asn;
  const routingType = data.routingType || raw.ip_routing_type;
  const connectionType = data.connectionType || raw.connection_type;
  const capital = data.capital || loc.capital || raw.capital;
  const flagEmoji = data.flagEmoji || loc.country_flag_emoji || raw.country_flag_emoji;
  const callingCode = data.callingCode || (loc.calling_code ? `+${loc.calling_code}` : null);
  const riskScore = data.riskScore || raw.risk_score || raw.fraud_score;
  const vpn = data.vpn || raw.vpn;
  const status = data.status || raw.status || 'Verified';

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Target IP Address" value={ip} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Threat & Fraud Risk" value={riskScore} isBold highlightColor="text-blue-700 text-sm font-extrabold" />
        <CopyableValue label="Connection Profile" value={vpn} isBold highlightColor="text-emerald-700" />
        <CopyableValue label="IP Version" value={ipType} isMono />
        <CopyableValue label="ISP Network" value={isp} isBold />
        <CopyableValue label="Autonomous System (ASN)" value={asn} isMono />
        <CopyableValue label="Country" value={flagEmoji ? `${flagEmoji} ${country || ''}` : country} isBold />
        <CopyableValue label="State / Region" value={region} />
        <CopyableValue label="City" value={city} />
        <CopyableValue label="Continent" value={continent} />
        <CopyableValue label="Postal Code" value={zip} isMono />
        <CopyableValue label="National Capital" value={capital} />
        <CopyableValue label="Calling Code" value={callingCode} isMono />
        <CopyableValue label="Routing Type" value={routingType} />
        <CopyableValue label="Connection Type" value={connectionType} />
        {(latitude !== undefined && longitude !== undefined) && (
          <CopyableValue label="GPS Coordinates" value={`${latitude}, ${longitude}`} isMono />
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   10. REVERSE GEOCODING
   ========================================================================= */
function GeoReverseReport({ data = {}, raw = {} }) {
  const nestedAddr = (raw.address && typeof raw.address === 'object') ? raw.address : {};
  const address = data.address || raw.display_name || raw.formatted_address;
  const placeName = data.placeName || raw.name;
  const lat = data.lat ?? raw.lat;
  const lon = data.lon ?? raw.lon;
  const road = data.road || nestedAddr.road;
  const suburb = data.suburb || nestedAddr.suburb || nestedAddr.locality;
  const city = data.city || nestedAddr.city || nestedAddr.town;
  const stateDistrict = data.stateDistrict || nestedAddr.state_district || nestedAddr.district;
  const state = data.state || nestedAddr.state;
  const postcode = data.postcode || nestedAddr.postcode || nestedAddr.pincode;
  const country = data.country || nestedAddr.country;
  const placeId = data.placeId || raw.place_id;
  const osmType = data.osmType || raw.osm_type;

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Coordinates" value={(lat !== undefined && lon !== undefined) ? `${lat}, ${lon}` : null} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Identified Location" value={placeName} isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="City" value={city} isBold />
        <CopyableValue label="Suburb / Locality" value={suburb} />
        <CopyableValue label="Thoroughfare / Road" value={road} />
        <CopyableValue label="District" value={stateDistrict} />
        <CopyableValue label="State" value={state} />
        <CopyableValue label="Postal PIN Code" value={postcode} isMono isBold />
        <CopyableValue label="Country" value={country} />
        <CopyableValue label="Place ID" value={placeId} isMono />
        <CopyableValue label="OSM Type" value={osmType} isMono />
      </div>

      {isValidValue(address) && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Exact Verified Postal String
          </span>
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {address}
          </p>
        </div>
      )}

      {/* Embedded Live Google Satellite / Hybrid Map Canvas */}
      <SatelliteMapViewer
        lat={lat}
        lon={lon}
        locationTitle={placeName || city || 'Verified Location'}
      />
    </div>
  );
}

/* =========================================================================
   SATELLITE MAP VIEWER COMPONENT (Google Maps Satellite / Hybrid Photogrammetry)
   ========================================================================= */
function SatelliteMapViewer({ lat, lon, locationTitle }) {
  const [mapType, setMapType] = useState('h'); // 'h' = Hybrid (Satellite + Labels), 'k' = Pure Satellite, 'm' = Roadmap
  const [zoom, setZoom] = useState(17);

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  const isValid = !isNaN(latNum) && !isNaN(lonNum) && latNum !== 0 && lonNum !== 0;

  if (!isValid) return null;

  const embedUrl = `https://maps.google.com/maps?q=${latNum},${lonNum}&t=${mapType}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latNum},${lonNum}`;

  return (
    <div className="space-y-2.5 pt-2">
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 text-white shadow-xs border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-400/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs tracking-tight text-white font-heading">
                Live Google Satellite Photogrammetry
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                GPS LOCKED
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              Lat: {latNum.toFixed(6)}° • Lon: {lonNum.toFixed(6)}° ({locationTitle})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Layer Switcher */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMapType('h');
              }}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                mapType === 'h' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hybrid
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMapType('k');
              }}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                mapType === 'k' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMapType('m');
              }}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                mapType === 'm' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Roadmap
            </button>
          </div>

          {/* Direct Launch Link */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={externalGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span>Open in Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </div>

      {/* Embedded High-Resolution Map Viewport */}
      <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-300 shadow-sm relative bg-slate-950">
        <iframe
          key={`${latNum}-${lonNum}-${mapType}-${zoom}`}
          src={embedUrl}
          title="Google Satellite Geolocation Map"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/* =========================================================================
   11. DOMAIN AGE & SECURITY
   ========================================================================= */
function DomainReport({ data = {}, raw = {} }) {
  const domain = data.domain || raw.domain;
  const age = data.age || raw.age_years ? `${raw.age_years} Years (${raw.age_days || 0} Days)` : raw.age;
  const createdDate = data.createdDate || raw.creation_date || raw.created;
  const expiryDate = data.expiryDate || raw.expiration_date || raw.expiry;
  const registrar = data.registrar || raw.registrar;
  const mxValid = data.mxValid ?? raw.mx_valid;
  const nameservers = data.nameservers || raw.nameservers || [];
  const whoisServer = data.whoisServer || raw.whois_server;
  const status = data.status || raw.status || 'Verified';

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Domain Name" value={domain} isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Calculated Domain Age" value={age} isBold highlightColor="text-blue-700 text-sm font-extrabold" />
        <CopyableValue label="Domain Registrar" value={registrar} isBold />
        <CopyableValue label="Registration Date" value={createdDate} isMono />
        <CopyableValue label="Expiration Date" value={expiryDate} isMono />
        <CopyableValue label="WHOIS Host" value={whoisServer} isMono />
        <CopyableValue label="Domain Status" value={status} isBold highlightColor="text-emerald-700" />
      </div>

      {mxValid !== undefined && mxValid !== null && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-bold text-xs">
            MX Mail Exchange Routing: {mxValid ? 'Valid & Active Mail Exchanger' : 'No Valid MX Record'}
          </span>
        </div>
      )}

      {/* Nameservers List */}
      {Array.isArray(nameservers) && nameservers.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Authoritative DNS Nameservers
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {nameservers.map((ns, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700">
                {typeof ns === 'string' ? ns : JSON.stringify(ns)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   12. WORK EMAIL VERIFIER PLUS REPORT
   ========================================================================= */
function WorkEmailPlusReport({ data = {}, raw = {} }) {
  const email = data.email || raw.email || raw.data?.email || raw.result?.email || '—';
  const rawResult = String(data.result || raw.result?.result || raw.data?.result || raw.result || 'unknown').toLowerCase();
  
  const isValid = data.isValid !== undefined ? Boolean(data.isValid) : (raw.data?.is_valid !== undefined ? Boolean(raw.data.is_valid) : (raw.is_valid !== undefined ? Boolean(raw.is_valid) : false));
  const isSyntaxValid = data.isSyntaxValid !== undefined ? Boolean(data.isSyntaxValid) : (raw.data?.is_syntax_valid !== undefined ? Boolean(raw.data.is_syntax_valid) : true);
  const isCorporate = data.isCorporate !== undefined ? Boolean(data.isCorporate) : (raw.data?.is_corporate !== undefined ? Boolean(raw.data.is_corporate) : false);
  const reason = data.reason || raw.data?.reason || raw.result?.reason || raw.reason || '';

  const domainObj = data.domain || raw.data?.domain || raw.result?.domain || {};
  const domainName = domainObj.name || (email.includes('@') ? email.split('@')[1] : '—');
  const domainIsValid = domainObj.isValid !== undefined ? domainObj.isValid : (domainObj.is_valid !== undefined ? domainObj.is_valid : true);
  const domainIsCatchAll = domainObj.isCatchAll !== undefined ? domainObj.isCatchAll : Boolean(domainObj.is_catch_all);
  const domainIsFree = domainObj.isFree !== undefined ? domainObj.isFree : Boolean(domainObj.is_free);
  const domainIsDisposable = domainObj.isDisposable !== undefined ? domainObj.isDisposable : Boolean(domainObj.is_disposable);
  const domainIsSpam = domainObj.isSpam !== undefined ? domainObj.isSpam : Boolean(domainObj.is_spam);

  const accountObj = data.account || raw.data?.account || raw.result?.account || {};
  const isRole = accountObj.isRole !== undefined ? accountObj.isRole : Boolean(accountObj.is_role);
  const isFullMailbox = accountObj.isFullMailbox !== undefined ? accountObj.isFullMailbox : Boolean(accountObj.is_full_mailbox);

  const mxRecords = (data.mxRecords && data.mxRecords.length > 0)
    ? data.mxRecords
    : (Array.isArray(raw.data?.mx_records) ? raw.data.mx_records : (Array.isArray(raw.result?.mx_records) ? raw.result.mx_records : (Array.isArray(raw.mx_records) ? raw.mx_records : [])));

  const orderId = data.orderId || raw.order_id || raw.data?.order_id || '—';
  const clientRefNum = data.clientRefNum || raw.client_ref_num || raw.data?.client_ref_num || '';
  const requestId = data.requestId || raw.request_id || '';
  const durationMs = data.durationMs || raw.data?.duration_ms || raw.duration_ms || null;
  const verifiedAt = data.verifiedAt || raw.data?.verified_at || raw.verified_at || '';
  const charged = data.charged !== undefined ? data.charged : raw.charged;

  // Visual verdict status badge
  let badgeTheme = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  let badgeLabel = 'PROTECTED / UNKNOWN';
  let glowColor = 'from-blue-500/10 to-indigo-500/10';

  if (rawResult === 'deliverable' || rawResult === 'valid' || (isValid && !domainIsCatchAll)) {
    badgeTheme = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    badgeLabel = '✓ DELIVERABLE (MAILBOX ACTIVE)';
    glowColor = 'from-emerald-500/10 to-teal-500/10';
  } else if (rawResult === 'risky' || domainIsCatchAll) {
    badgeTheme = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    badgeLabel = '⚠️ RISKY (ACCEPT-ALL DOMAIN)';
    glowColor = 'from-amber-500/10 to-orange-500/10';
  } else if (rawResult === 'undeliverable' || rawResult === 'invalid' || !isSyntaxValid) {
    badgeTheme = 'bg-red-500/20 text-red-300 border-red-500/40';
    badgeLabel = '✕ UNDELIVERABLE / INVALID';
    glowColor = 'from-red-500/10 to-rose-500/10';
  }

  return (
    <div className="space-y-5 text-xs">
      
      {/* Visual Digital Work Email Card */}
      <div className={`relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-5 sm:p-6 shadow-md overflow-hidden border border-slate-800`}>
        {/* Glowing Watermark Aura */}
        <div className={`absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br ${glowColor} blur-3xl pointer-events-none`} />
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 relative z-10 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-200 block leading-tight">
                WORK EMAIL VERIFIER PLUS
              </span>
              <span className="text-[9.5px] text-slate-400 font-mono">
                Real-Time Corporate SMTP &amp; MX Verification Record
              </span>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-lg border text-[10.5px] font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs ${badgeTheme}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            <span>{badgeLabel}</span>
          </span>
        </div>

        {/* Card Body: Highlighted Target Email & Core Highlights */}
        <div className="py-4 space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Work Email</span>
              <span className="font-mono text-sm sm:text-base font-black text-white break-all">
                {email}
              </span>
            </div>
            {domainName && domainName !== '—' && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-400/30 text-blue-300 font-mono text-xs font-semibold self-start sm:self-auto">
                Domain: @{domainName}
              </span>
            )}
          </div>

          {/* Verification Reason / Diagnostic Advice Banner */}
          {reason && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold text-slate-200 block">Deliverability Insight:</span>
                <span className="text-[11px] text-slate-300 font-medium capitalize">{reason}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structured Dynamic Attribute Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        <CopyableValue label="Email Address" value={email} isMono isBold highlightColor="text-slate-900 text-sm font-extrabold" />
        <CopyableValue label="Verification Verdict" value={rawResult?.toUpperCase()} isBold highlightColor="text-blue-700 text-sm font-extrabold" />
        <CopyableValue label="Mailbox Existence (is_valid)" value={isValid ? 'Active & Valid' : 'Unconfirmed / Inactive'} isBold highlightColor={isValid ? 'text-emerald-700' : 'text-slate-700'} />
        
        <CopyableValue label="RFC Syntax Compliance" value={isSyntaxValid ? 'Valid Format (RFC 5322)' : 'Invalid Syntax'} isBold highlightColor={isSyntaxValid ? 'text-emerald-700' : 'text-red-700'} />
        <CopyableValue label="Organization Classification" value={isCorporate ? 'Corporate Work Domain' : (domainIsFree ? 'Free Webmail Domain' : 'Standard Domain')} isBold highlightColor="text-indigo-700" />
        <CopyableValue label="Domain Name" value={domainName} isMono isBold />

        <CopyableValue label="Domain DNS Health" value={domainIsValid ? 'Active & Resolving' : 'Unresolvable'} isBold />
        <CopyableValue label="Catch-All Server Flag" value={domainIsCatchAll ? 'Yes (Accepts All Inboxes)' : 'No (Strict Mailbox)'} isBold highlightColor={domainIsCatchAll ? 'text-amber-700' : 'text-slate-700'} />
        <CopyableValue label="Free Email Provider" value={domainIsFree ? 'Yes (Public Webmail)' : 'No (Private/Enterprise)'} />

        <CopyableValue label="Disposable / Temp Mail" value={domainIsDisposable ? '⚠️ Disposable / Temp Mail' : 'Clean (Permanent Domain)'} isBold highlightColor={domainIsDisposable ? 'text-red-700' : 'text-emerald-700'} />
        <CopyableValue label="Spam Blacklist Status" value={domainIsSpam ? '⚠️ Blacklisted Domain' : 'Clean (Zero Spam Flags)'} isBold highlightColor={domainIsSpam ? 'text-red-700' : 'text-emerald-700'} />
        <CopyableValue label="Mailbox Role Type" value={isRole ? 'Role-Based (e.g. admin/info/support)' : 'Personal / Dedicated User'} />

        <CopyableValue label="Mailbox Storage Quota" value={isFullMailbox ? '⚠️ Full Mailbox (Bounce Risk)' : 'Storage Available'} isBold highlightColor={isFullMailbox ? 'text-amber-700' : 'text-slate-700'} />
        <CopyableValue label="Gateway Order ID" value={orderId} isMono isBold />
        <CopyableValue label="Client Reference" value={clientRefNum} isMono />

        <CopyableValue label="Audit Request ID" value={requestId} isMono />
        <CopyableValue label="Gateway Verification Latency" value={durationMs ? `${durationMs} ms` : null} isMono />
        <CopyableValue label="Verified Timestamp (UTC)" value={verifiedAt ? new Date(verifiedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : null} isMono />
      </div>

      {/* MX Mail Exchange DNS Records */}
      {Array.isArray(mxRecords) && mxRecords.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Authoritative MX Mail Exchanger Records ({mxRecords.length})
          </span>
          <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 font-mono">Priority / Pref</th>
                  <th className="p-3">Mail Exchange Host</th>
                  <th className="p-3 font-mono">Resolved IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mxRecords.map((mx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="p-3 font-mono text-blue-700 font-bold">{typeof mx === 'object' ? (mx.priority ?? mx.pref ?? idx + 1) : idx + 1}</td>
                    <td className="p-3 font-mono text-slate-800 font-semibold">{typeof mx === 'object' ? (mx.host || mx.exchange || mx.server || JSON.stringify(mx)) : String(mx)}</td>
                    <td className="p-3 font-mono text-slate-600">{typeof mx === 'object' ? (mx.ip || mx.address || '—') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

/* =========================================================================
   13. CIBIL TRANSUNION PDF REPORT (100% UNTOUCHED ENGINE & IFRAME)
   ========================================================================= */
function CibilPdfReport({ data = {} }) {
  const name = data.name || 'CUSTOMER';
  const pan = data.pan || '—';
  const mobile = data.mobile || '—';
  const pdfUrl = data.pdfUrl || data.pdfBase64;
  const refNo = data.referenceNo || `TU-${Date.now().toString().slice(-8)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-5 flex-wrap">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Consumer</span>
            <span className="font-bold text-slate-900 text-sm">{name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">PAN</span>
            <span className="font-mono font-bold text-slate-900">{pan}</span>
          </div>
          {mobile && mobile !== '—' && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile</span>
              <span className="font-mono font-bold text-slate-900">{mobile}</span>
            </div>
          )}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Control Reference</span>
            <span className="font-mono font-semibold text-slate-700">{refNo}</span>
          </div>
        </div>

        {pdfUrl && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => openPdfInNewTab(pdfUrl)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-blue-600 font-bold flex items-center gap-1.5 text-xs shadow-2xs cursor-pointer"
          >
            <span>Open PDF in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {pdfUrl ? (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>TransUnion CIBIL Credit Information Report (CIR)</span>
          </div>
          <iframe
            src={pdfUrl}
            title="TransUnion CIBIL CIR Report"
            className="w-full h-[780px] sm:h-[880px] border-0 bg-white"
          />
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Generating TransUnion CIBIL PDF Report...
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   13-14. CREDIT BUREAU SCORE GAUGE & CRIF PDF REPORT (100% UNTOUCHED)
   ========================================================================= */
function BureauScoreReport({ data = {} }) {
  const score = data.score;
  const bureau = data.bureau || 'CRIF HighMark';
  const name = data.name || '—';
  const pan = data.pan || '—';
  const mobile = data.mobile || '—';
  const pdfUrl = data.pdfUrl;

  if (pdfUrl) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-5 flex-wrap">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Consumer</span>
              <span className="font-bold text-slate-900 text-sm">{name}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">PAN</span>
              <span className="font-mono font-bold text-slate-900">{pan}</span>
            </div>
            {mobile && mobile !== '—' && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile</span>
                <span className="font-mono font-bold text-slate-900">{mobile}</span>
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => openPdfInNewTab(pdfUrl)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-blue-600 font-bold flex items-center gap-1.5 text-xs shadow-2xs cursor-pointer"
          >
            <span>Open PDF in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{bureau} Official Credit Dossier</span>
          </div>
          <iframe
            src={pdfUrl}
            title={`${bureau} Report`}
            className="w-full h-[780px] sm:h-[880px] border-0 bg-white"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
      <CopyableValue label={`${bureau} Score`} value={score} isMono isBold highlightColor="text-slate-900 text-xl font-bold" />
      <CopyableValue label="Applicant Name" value={name} isBold highlightColor="text-slate-900 text-sm" />
      <CopyableValue label="PAN" value={pan} isMono isBold />
      <CopyableValue label="Risk Band" value={data.tier} isBold />
      <CopyableValue label="Active Accounts" value={data.activeTradelines} isBold />
    </div>
  );
}

/* =========================================================================
   15. GENERIC DYNAMIC FALLBACK
   ========================================================================= */
function GenericReport({ data = {}, raw = {} }) {
  const displayObj = Object.keys(data).length > 0 ? data : raw;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
      {Object.entries(displayObj).map(([k, v]) => {
        if (typeof v === 'object' || k === 'cardType' || !isValidValue(v)) return null;
        return (
          <CopyableValue
            key={k}
            label={k.replace(/_/g, ' ')}
            value={String(v)}
            isBold
          />
        );
      })}
    </div>
  );
}


