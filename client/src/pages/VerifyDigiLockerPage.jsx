import React, { useState } from 'react';
import {
  Fingerprint,
  RotateCcw,
  AlertCircle,
  Check
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import Button from '../components/common/Button.jsx';
import DigiLockerDossierCard from '../components/dossiers/DigiLockerDossierCard.jsx';
import CertifiedHeader from '../components/dossiers/CertifiedHeader.jsx';

export default function VerifyDigiLockerPage() {
  const { handleVerify } = useVerification();

  const [aadhaarNumber, setAadhaarNumber] = useState('984512348921');
  const [fullName, setFullName] = useState('SHUBHAM AGRAWAL');
  const [dateOfBirth, setDateOfBirth] = useState('1994-08-15');
  const [otp, setOtp] = useState('849201');
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultDossier, setResultDossier] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!aadhaarNumber || aadhaarNumber.replace(/\s|-/g, '').length < 4) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    if (!consent) {
      setError('Please check the confirmation box below to proceed.');
      return;
    }

    try {
      setLoading(true);
      const dossier = await handleVerify('DIGILOCKER', {
        aadhaarNumber,
        fullName,
        dateOfBirth,
        otp,
        consent
      });
      setResultDossier(dossier);
    } catch (err) {
      setError(err.message || 'Aadhaar verification failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verify Aadhaar Card
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check official name, verified photo, date of birth, and home address.
          </p>
        </div>

        {resultDossier && (
          <button
            onClick={() => setResultDossier(null)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Verify Another Aadhaar</span>
          </button>
        )}
      </div>

      {!resultDossier ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card">
            <div className="pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-sm font-bold text-slate-900">
                Enter Aadhaar Information
              </h3>
              <p className="text-xs text-slate-500">Provide details to retrieve verified Aadhaar record</p>
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
                    12-Digit Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9845 1234 8921"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    One-Time Password (OTP)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. SHUBHAM AGRAWAL"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-50/60 border border-brand-200/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <div className="text-xs text-brand-950 leading-relaxed font-medium">
                    I confirm that the resident has given permission to verify their Aadhaar details.
                  </div>
                </label>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full font-bold"
                >
                  Verify Aadhaar Card Now
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                What you get:
              </h3>
              <div className="space-y-2.5 pt-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Verified resident photo</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Full name & father's name</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Verified complete home address</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Safe & masked Aadhaar format (XXXX-XXXX-8921)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <CertifiedHeader dossier={resultDossier} />
          <DigiLockerDossierCard dossier={resultDossier} />
        </div>
      )}
    </div>
  );
}
