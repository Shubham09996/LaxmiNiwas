import React, { useState } from 'react';
import {
  TrendingUp,
  RotateCcw,
  AlertCircle,
  Check
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import Button from '../components/common/Button.jsx';
import CibilDossierCard from '../components/dossiers/CibilDossierCard.jsx';
import CertifiedHeader from '../components/dossiers/CertifiedHeader.jsx';

export default function VerifyCibilPage() {
  const { handleVerify } = useVerification();

  const [panNumber, setPanNumber] = useState('AAACL7821M');
  const [fullName, setFullName] = useState('SHUBHAM AGRAWAL');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultDossier, setResultDossier] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!panNumber || panNumber.trim().length !== 10) {
      setError('Please enter a valid 10-character PAN number.');
      return;
    }

    if (!consent) {
      setError('Please check the confirmation box below to proceed.');
      return;
    }

    try {
      setLoading(true);
      const dossier = await handleVerify('CIBIL', {
        panNumber: panNumber.toUpperCase().trim(),
        fullName,
        mobileNumber,
        consent
      });
      setResultDossier(dossier);
    } catch (err) {
      setError(err.message || 'Credit score check failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-sky-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Check Credit Score
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check your credit score (300–900), active loans, credit card balances, and payment history.
          </p>
        </div>

        {resultDossier && (
          <button
            onClick={() => setResultDossier(null)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Check Another Score</span>
          </button>
        )}
      </div>

      {!resultDossier ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
            <div className="pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-sm font-bold text-slate-900">
                Enter Person's Details
              </h3>
              <p className="text-xs text-slate-500">Provide details to pull official credit score</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    PAN Card Number *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-brand-500 uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <div className="text-xs text-sky-950 leading-relaxed font-medium">
                    I confirm that I have permission to check the credit report for this person.
                  </div>
                </label>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 ring-sky-700/20 shadow-sky-600/10 font-bold"
                >
                  Check Credit Score Now
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Score Guide:
              </h3>
              <div className="space-y-2 pt-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-emerald-700 font-bold">750 – 900</span>
                  <span className="font-semibold text-slate-700">Excellent (Prime)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-sky-700 font-bold">700 – 749</span>
                  <span className="font-semibold text-slate-700">Good</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-amber-700 font-bold">650 – 699</span>
                  <span className="font-semibold text-slate-700">Average</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-red-700 font-bold">Below 650</span>
                  <span className="font-semibold text-slate-700">Needs Attention</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <CertifiedHeader dossier={resultDossier} />
          <CibilDossierCard dossier={resultDossier} />
        </div>
      )}
    </div>
  );
}
