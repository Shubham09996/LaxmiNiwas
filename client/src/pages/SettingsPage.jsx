import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Lock,
  Building,
  CheckCircle2,
  Save,
  Server
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/common/Button.jsx';

export default function SettingsPage() {
  const { addToast } = useToast();

  const [companyName, setCompanyName] = useState('Laxmi Niwas Enterprises Private Limited');
  const [adminEmail, setAdminEmail] = useState('admin@laxminiwas.com');
  const [webhookUrl, setWebhookUrl] = useState('https://api.laxminiwas.com/v1/webhooks/verify-events');
  const [autoRevokeDays, setAutoRevokeDays] = useState('90');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [auditRetentionDays, setAuditRetentionDays] = useState('365');

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      title: 'Settings Updated',
      message: 'Workspace and compliance configurations saved successfully.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Platform Settings & Governance
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure institutional verification policies, audit retention, and API endpoints.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Organization Info */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Organization Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Entity Legal Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Super Admin Contact Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Cryptography Governance */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Security & Tamper-Evident Hash Policies
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Mandatory 2FA for Dossier Deletion / Secret Export</span>
                <span className="text-[11px] text-slate-500">Require hardware security key or TOTP for sensitive actions</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Audit Log Immutable Retention
                </label>
                <select
                  value={auditRetentionDays}
                  onChange={(e) => setAuditRetentionDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  <option value="180">180 Days (6 Months)</option>
                  <option value="365">365 Days (1 Year - Statutory)</option>
                  <option value="1825">1825 Days (5 Years - RBI Grade)</option>
                  <option value="3650">3650 Days (10 Years - Permanent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Automated API Key Rotation Cycle
                </label>
                <select
                  value={autoRevokeDays}
                  onChange={(e) => setAutoRevokeDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  <option value="30">30 Days</option>
                  <option value="90">90 Days (Recommended)</option>
                  <option value="180">180 Days</option>
                  <option value="365">365 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Global Webhook Dispatcher */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Server className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Real-Time Webhook Endpoint
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Production Webhook Dispatch URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-brand-500"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Events dispatched: <code>dossier.certified</code>, <code>dossier.flagged</code>, <code>key.rotated</code>
            </span>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          icon={Save}
        >
          Save Configuration Changes
        </Button>
      </form>
    </div>
  );
}
