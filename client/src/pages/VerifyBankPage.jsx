import React, { useState } from 'react';
import {
  Landmark,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import Button from '../components/common/Button.jsx';
import BankDossierCard from '../components/dossiers/BankDossierCard.jsx';
import CertifiedHeader from '../components/dossiers/CertifiedHeader.jsx';

export default function VerifyBankPage() {
  const { handleVerify } = useVerification();

  const [accountNumber, setAccountNumber] = useState('50200049281729');
  const [ifscCode, setIfscCode] = useState('HDFC0000060');
  const [expectedName, setExpectedName] = useState('LAXMI NIWAS INFOTECH PVT LTD');
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultDossier, setResultDossier] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!accountNumber || accountNumber.trim().length < 6) {
      setError('Please enter a valid bank account number.');
      return;
    }

    if (!ifscCode || ifscCode.trim().length !== 11) {
      setError('Please enter a valid 11-character IFSC code (e.g. HDFC0000060).');
      return;
    }

    try {
      setLoading(true);
      const dossier = await handleVerify('BANK', {
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.toUpperCase().trim(),
        expectedName,
        consent
      });
      setResultDossier(dossier);
    } catch (err) {
      setError(err.message || 'Bank account verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verify Bank Account
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Instantly check if the bank account is active and verify the account holder's registered name.
          </p>
        </div>

        {resultDossier && (
          <button
            onClick={() => setResultDossier(null)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Verify Another Account</span>
          </button>
        )}
      </div>

      {!resultDossier ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card max-w-2xl">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-sm font-bold text-slate-900">
              Enter Bank Details
            </h3>
            <p className="text-xs text-slate-500">Provide account number and IFSC to check name match</p>
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
                Bank Account Number *
              </label>
              <input
                type="text"
                placeholder="e.g. 50200049281729"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Bank Branch IFSC Code *
              </label>
              <input
                type="text"
                maxLength={11}
                placeholder="e.g. HDFC0000060"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-brand-500 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Expected Account Holder Name
              </label>
              <input
                type="text"
                value={expectedName}
                onChange={(e) => setExpectedName(e.target.value)}
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
                Verify Bank Account Now
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <CertifiedHeader dossier={resultDossier} />
          <BankDossierCard dossier={resultDossier} />
        </div>
      )}
    </div>
  );
}
