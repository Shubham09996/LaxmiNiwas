import React, { useState } from 'react';
import {
  FileText,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import Button from '../components/common/Button.jsx';
import GstDossierCard from '../components/dossiers/GstDossierCard.jsx';
import CertifiedHeader from '../components/dossiers/CertifiedHeader.jsx';

export default function VerifyGstPage() {
  const { handleVerify } = useVerification();

  const [gstin, setGstin] = useState('07AAACL7821M1Z5');
  const [legalName, setLegalName] = useState('LAXMI NIWAS INFOTECH PVT LTD');
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultDossier, setResultDossier] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!gstin || gstin.trim().length !== 15) {
      setError('Please enter a valid 15-character GST number (e.g. 07AAACL7821M1Z5).');
      return;
    }

    try {
      setLoading(true);
      const dossier = await handleVerify('GST', {
        gstin: gstin.toUpperCase().trim(),
        legalName,
        consent
      });
      setResultDossier(dossier);
    } catch (err) {
      setError(err.message || 'GST verification failed. Please check the GST number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verify GST Number
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check company business name, active GST status, and tax filing record.
          </p>
        </div>

        {resultDossier && (
          <button
            onClick={() => setResultDossier(null)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Check Another GST</span>
          </button>
        )}
      </div>

      {!resultDossier ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card max-w-2xl">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-sm font-bold text-slate-900">
              Enter GST Number
            </h3>
            <p className="text-xs text-slate-500">Search government tax registry for business details</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                15-Digit GST Number *
              </label>
              <input
                type="text"
                maxLength={15}
                placeholder="e.g. 07AAACL7821M1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-brand-500 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Business / Company Name
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full font-bold"
              >
                Verify GST Number Now
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <CertifiedHeader dossier={resultDossier} />
          <GstDossierCard dossier={resultDossier} />
        </div>
      )}
    </div>
  );
}
