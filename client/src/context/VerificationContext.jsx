import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const VerificationContext = createContext(null);

export function VerificationProvider({ children }) {
  const [dossiers, setDossiers] = useState([]);
  const [services, setServices] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDossierModal, setActiveDossierModal] = useState(null);

  const { addToast } = useToast();

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [dossierRes, serviceRes, metricRes, keyRes, auditRes] = await Promise.all([
        api.getDossiers({ type: filterType, status: filterStatus, search: searchQuery }),
        api.getServices(),
        api.getMetrics(),
        api.getApiKeys(),
        api.getAuditLogs()
      ]);

      if (dossierRes?.data) setDossiers(dossierRes.data);
      if (serviceRes?.data) setServices(serviceRes.data);
      if (metricRes?.data) setMetrics(metricRes.data);
      if (keyRes?.data) setApiKeys(keyRes.data);
      if (auditRes?.data) setAuditLogs(auditRes.data);
    } catch (err) {
      console.error('Failed to load initial verification platform data:', err);
      addToast({
        title: 'Connection Notice',
        message: 'Could not sync with backend server. Using cached data.',
        type: 'warning'
      });
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, searchQuery, addToast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Execute Verification Handlers
  const handleVerify = async (serviceType, payload) => {
    try {
      let res;
      switch (serviceType) {
        case 'PAN':
          res = await api.verifyPan(payload);
          break;
        case 'DIGILOCKER':
          res = await api.verifyDigiLocker(payload);
          break;
        case 'CIBIL':
          res = await api.verifyCibil(payload);
          break;
        case 'GST':
          res = await api.verifyGst(payload);
          break;
        case 'BANK':
          res = await api.verifyBank(payload);
          break;
        case 'MCA':
          res = await api.verifyMca(payload);
          break;
        default:
          throw new Error(`Unsupported verification service type: ${serviceType}`);
      }

      if (res.success && res.data) {
        const newDossier = res.data;
        setDossiers(prev => [newDossier, ...prev]);

        addToast({
          title: 'Verification Certified',
          message: `Dossier ${newDossier.refId} successfully generated for ${newDossier.entityName}.`,
          type: 'success'
        });

        // Refresh metrics & logs
        api.getMetrics().then(m => m?.data && setMetrics(m.data)).catch(() => {});
        api.getAuditLogs().then(a => a?.data && setAuditLogs(a.data)).catch(() => {});

        return newDossier;
      }
    } catch (err) {
      addToast({
        title: 'Verification Error',
        message: err.message || 'An error occurred during verification.',
        type: 'error'
      });
      throw err;
    }
  };

  const copyToClipboard = (text, label = 'Reference ID') => {
    navigator.clipboard.writeText(text);
    addToast({
      title: 'Copied to Clipboard',
      message: `${label} "${text}" copied.`,
      type: 'success',
      duration: 2000
    });
  };

  return (
    <VerificationContext.Provider
      value={{
        dossiers,
        services,
        metrics,
        apiKeys,
        auditLogs,
        loading,
        filterType,
        setFilterType,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        activeDossierModal,
        setActiveDossierModal,
        handleVerify,
        copyToClipboard,
        refreshData: fetchAllData
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
