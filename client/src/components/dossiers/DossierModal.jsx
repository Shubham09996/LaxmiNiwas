import React from 'react';
import Modal from '../common/Modal.jsx';
import { useVerification } from '../../context/VerificationContext.jsx';
import CertifiedHeader from './CertifiedHeader.jsx';
import PanDossierCard from './PanDossierCard.jsx';
import DigiLockerDossierCard from './DigiLockerDossierCard.jsx';
import CibilDossierCard from './CibilDossierCard.jsx';
import GstDossierCard from './GstDossierCard.jsx';
import BankDossierCard from './BankDossierCard.jsx';
import McaDossierCard from './McaDossierCard.jsx';

export default function DossierModal() {
  const { activeDossierModal, setActiveDossierModal } = useVerification();

  if (!activeDossierModal) return null;

  const type = activeDossierModal.type;

  return (
    <Modal
      isOpen={!!activeDossierModal}
      onClose={() => setActiveDossierModal(null)}
      title="Certified Verification Dossier"
      subtitle={`Dossier Ref: ${activeDossierModal.refId || activeDossierModal.id}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <CertifiedHeader dossier={activeDossierModal} />

        {type === 'PAN_VERIFICATION' && <PanDossierCard dossier={activeDossierModal} />}
        {type === 'DIGILOCKER_KYC' && <DigiLockerDossierCard dossier={activeDossierModal} />}
        {type === 'CIBIL_CREDIT_REPORT' && <CibilDossierCard dossier={activeDossierModal} />}
        {type === 'GSTIN_COMPLIANCE' && <GstDossierCard dossier={activeDossierModal} />}
        {type === 'BANK_PENNY_DROP' && <BankDossierCard dossier={activeDossierModal} />}
        {type === 'MCA_CORPORATE_DATA' && <McaDossierCard dossier={activeDossierModal} />}
        
        {/* Fallback for general services */}
        {!['PAN_VERIFICATION', 'DIGILOCKER_KYC', 'CIBIL_CREDIT_REPORT', 'GSTIN_COMPLIANCE', 'BANK_PENNY_DROP', 'MCA_CORPORATE_DATA'].includes(type) && (
          <PanDossierCard dossier={activeDossierModal} />
        )}
      </div>
    </Modal>
  );
}
