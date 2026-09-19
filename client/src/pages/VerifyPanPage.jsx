import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import Button from '../components/common/Button.jsx';
import PanDossierCard from '../components/dossiers/PanDossierCard.jsx';
import CertifiedHeader from '../components/dossiers/CertifiedHeader.jsx';

export default function VerifyPanPage() {
  const { handleVerify } = useVerification();

  const [panNumber, setPanNumber] = useState('AAACL7821M');
  const [holderName, setHolderName] = useState('LAXMI NIWAS INFOTECH PVT LTD');
  const [dateOfBirth, setDateOfBirth] = useState('2019-04-12');
  const [panType, setPanType] = useState('Company');
  const [consent, setConsent] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultDossier, setResultDossier] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!panNumber || panNumber.trim().length !== 10) {
      setError('Please enter a valid 10-character PAN number (e.g. AAACL7821M).');
      return;
    }

    if (!consent) {
      setError('Please check the confirmation box below to proceed.');
      return;
    }

    try {
      setLoading(true);
      const dossier = await handleVerify('PAN', {
        panNumber: panNumber.toUpperCase().trim(),
        holderName,
        dateOfBirth,
        panType,
        consent
      });
      setResultDossier(dossier);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the PAN number.');
    } finally {
      setLoading(false);
    }
  };

  const autofillSample = (type) => {
    if (type === 'company') {
      setPanNumber('AAACL7821M');
      setHolderName('LAXMI NIWAS INFOTECH PVT LTD');
      setDateOfBirth('2019-04-12');
      setPanType('Company');
      setConsent(true);
    } else {
      setPanNumber('ABCPA1234F');
      setHolderName('SHUBHAM AGRAWAL');
      setDateOfBirth('1994-08-15');
      setPanType('Individual');
      setConsent(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verify PAN Card
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check PAN validity, active status, holder name, and Aadhaar link in seconds.
          </p>
        </div>

        {resultDossier && (
          <button
            onClick={() => setResultDossier(null)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Verify Another PAN</span>
          </button>
        )}
      </div>

      {!resultDossier ? (
        /* Form Section */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Enter PAN Card Details
                </h3>
                <p className="text-xs text-slate-500">Fill in the information below to check PAN status</p>
              </div>

              {/* Sample Fill Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => autofillSample('company')}
                  className="text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors border border-brand-200"
                >
                  Fill Company Example
                </button>
                <button
                  type="button"
                  onClick={() => autofillSample('individual')}
                  className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                >
                  Fill Person Example
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PAN Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    PAN Card Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="e.g. AAACL7821M"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition-all uppercase"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-slate-400">
                      {panNumber.length}/10
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Category / Type
                  </label>
                  <select
                    value={panType}
                    onChange={(e) => setPanType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Company">Company / Business</option>
                    <option value="Individual">Individual (Person)</option>
                    <option value="Firm / LLP">Partnership Firm / LLP</option>
                    <option value="Trust">Trust / NGO</option>
                    <option value="HUF">Hindu Undivided Family (HUF)</option>
                  </select>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Name on PAN Card
                </label>
                <input
                  type="text"
                  placeholder="e.g. LAXMI NIWAS INFOTECH PVT LTD"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Date of Birth / Registration Date
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Simple Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-50/60 border border-brand-200/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <div className="text-xs text-brand-950 leading-relaxed font-medium">
                    I confirm that I have valid permission to verify this PAN card detail.
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full font-bold"
                >
                  Verify PAN Card Now
                </Button>
              </div>
            </form>
          </div>

          {/* Simple Info Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                What you get:
              </h3>
              <div className="space-y-2.5 pt-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Real-time active status check</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Official name & date of birth match</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Aadhaar link verification</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Instant downloadable report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Result View */
        <div className="space-y-6">
          <CertifiedHeader dossier={resultDossier} />
          <PanDossierCard dossier={resultDossier} />
        </div>
      )}
    </div>
  );
}
