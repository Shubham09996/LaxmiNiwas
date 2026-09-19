import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api.js';
import { useVerification } from '../context/VerificationContext.jsx';
import VerificationStreamTable from '../components/dashboard/VerificationStreamTable.jsx';
import CertifiedHeader from '../components/dossiers/CertifiedHeader.jsx';
import PanDossierCard from '../components/dossiers/PanDossierCard.jsx';
import DigiLockerDossierCard from '../components/dossiers/DigiLockerDossierCard.jsx';
import CibilDossierCard from '../components/dossiers/CibilDossierCard.jsx';
import GstDossierCard from '../components/dossiers/GstDossierCard.jsx';
import BankDossierCard from '../components/dossiers/BankDossierCard.jsx';
import McaDossierCard from '../components/dossiers/McaDossierCard.jsx';

export default function DossierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dossiers } = useVerification();

  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const local = dossiers.find(d => d.id === id || d.refId === id);
      if (local) {
        setDossier(local);
      } else {
        setLoading(true);
        api.getDossierById(id)
          .then(res => {
            if (res.data) setDossier(res.data);
            else setError('Report not found');
          })
          .catch(err => setError(err.message || 'Failed to load report'))
          .finally(() => setLoading(false));
      }
    } else {
      setDossier(null);
    }
  }, [id, dossiers]);

  if (!id) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              All Verification Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, view, and print past verification reports.
          </p>
        </div>

        <VerificationStreamTable showControls={true} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading verification report...</p>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Report Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">{error || `No report found matching ID ${id}`}</p>
        <button
          onClick={() => navigate('/dossiers')}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          Return to Reports List
        </button>
      </div>
    );
  }

  const type = dossier.type;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dossiers')}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
          title="Back to Reports"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Verification Report: {dossier.refId || dossier.id}
          </h1>
          <p className="text-xs text-slate-500">Official verified details for {dossier.entityName}</p>
        </div>
      </div>

      <CertifiedHeader dossier={dossier} />

      {type === 'PAN_VERIFICATION' && <PanDossierCard dossier={dossier} />}
      {type === 'DIGILOCKER_KYC' && <DigiLockerDossierCard dossier={dossier} />}
      {type === 'CIBIL_CREDIT_REPORT' && <CibilDossierCard dossier={dossier} />}
      {type === 'GSTIN_COMPLIANCE' && <GstDossierCard dossier={dossier} />}
      {type === 'BANK_PENNY_DROP' && <BankDossierCard dossier={dossier} />}
      {type === 'MCA_CORPORATE_DATA' && <McaDossierCard dossier={dossier} />}
      {!['PAN_VERIFICATION', 'DIGILOCKER_KYC', 'CIBIL_CREDIT_REPORT', 'GSTIN_COMPLIANCE', 'BANK_PENNY_DROP', 'MCA_CORPORATE_DATA'].includes(type) && (
        <PanDossierCard dossier={dossier} />
      )}
    </div>
  );
}
