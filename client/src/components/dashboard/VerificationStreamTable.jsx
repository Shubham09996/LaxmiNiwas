import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Copy,
  ExternalLink,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useVerification } from '../../context/VerificationContext.jsx';
import StatusBadge from '../common/StatusBadge.jsx';

export default function VerificationStreamTable({ limit, showControls = true }) {
  const {
    dossiers,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    copyToClipboard,
    setActiveDossierModal
  } = useVerification();

  const navigate = useNavigate();
  const displayedDossiers = limit ? dossiers.slice(0, limit) : dossiers;

  const statusTabs = [
    { label: 'All Checks', value: 'ALL' },
    { label: 'Verified', value: 'CERTIFIED' },
    { label: 'Review Needed', value: 'MANUAL_REVIEW' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card overflow-hidden">
      {/* Table Header & Filters */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Recent Verifications
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            List of recent verification checks and their results
          </p>
        </div>

        {showControls && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status Pills */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs">
              {statusTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    filterStatus === tab.value
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Service Type Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500 shadow-2xs"
            >
              <option value="ALL">All Services</option>
              <option value="PAN_VERIFICATION">PAN Card</option>
              <option value="DIGILOCKER_KYC">Aadhaar Card</option>
              <option value="CIBIL_CREDIT_REPORT">Credit Score</option>
              <option value="GSTIN_COMPLIANCE">GST Number</option>
              <option value="BANK_PENNY_DROP">Bank Account</option>
              <option value="MCA_CORPORATE_DATA">Company</option>
            </select>
          </div>
        )}
      </div>

      {/* Tabular Stream */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Report ID</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Name & ID</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedDossiers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <FileCheck2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-bold text-slate-600">No records found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try changing your search or filter</p>
                </td>
              </tr>
            ) : (
              displayedDossiers.map(dossier => (
                <tr key={dossier.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Report ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className="text-brand-700">{dossier.refId || dossier.id}</span>
                      <button
                        onClick={() => copyToClipboard(dossier.refId || dossier.id, 'Report ID')}
                        className="text-slate-300 hover:text-brand-600 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{dossier.serviceTitle}</span>
                  </td>

                  {/* Entity */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                      {dossier.entityName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 block mt-0.5">
                      {dossier.entityIdentifier}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="block font-medium">
                      {new Date(dossier.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {new Date(dossier.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={dossier.status} size="xs" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setActiveDossierModal(dossier)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 hover:bg-brand-100/80 text-brand-700 rounded-xl font-bold text-xs transition-colors shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => navigate(`/dossiers/${dossier.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Open Full Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {limit && dossiers.length > limit && (
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-center">
          <button
            onClick={() => navigate('/dossiers')}
            className="text-xs font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5"
          >
            <span>View All Verification Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
