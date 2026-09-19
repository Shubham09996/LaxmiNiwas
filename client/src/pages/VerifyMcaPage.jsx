import React, { useState } from 'react';
import {
  Building2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import Button from '../components/common/Button.jsx';
import McaDossierCard from '../components/dossiers/McaDossierCard.jsx';
import CertifiedHeader from '../components/dossiers/CertifiedHeader.jsx';

export default function VerifyMcaPage() {
  const { handleVerify } = useVerification();

  const [cin, setCin] = useState('U72900DL2019PTC348912');
  const [companyName, setCompanyName] = useState('LAXMI NIWAS INFOTECH PVT LTD');
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultDossier, setResultDossier] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cin || cin.trim().length < 5) {
      setError('Please enter a valid CIN or company name.');
      return;
    }

    try {
      setLoading(true);
      const dossier = await handleVerify('MCA', {
        cin: cin.toUpperCase().trim(),
        companyName,
        consent
      });
      setResultDossier(dossier);
    } catch (err) {
      setError(err.message || 'Company verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verify Company Details
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check official company registration, registered directors, and active company status.
          </p>
        </div>

        {resultDossier && (
          <button
            onClick={() => setResultDossier(null)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Check Another Company</span>
          </button>
        )}
      </div>

      {!resultDossier ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card max-w-2xl">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-sm font-bold text-slate-900">
              Enter Company Information
            </h3>
            <p className="text-xs text-slate-500">Provide CIN or name to view official records</p>
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
                Company CIN Number *
              </label>
              <input
                type="text"
                maxLength={21}
                placeholder="e.g. U72900DL2019PTC348912"
                value={cin}
                onChange={(e) => setCin(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-brand-500 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Company Legal Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
                Verify Company Now
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <CertifiedHeader dossier={resultDossier} />
          <McaDossierCard dossier={resultDossier} />
        </div>
      )}
    </div>
  );
}
