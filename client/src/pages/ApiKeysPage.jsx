import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Trash2
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext.jsx';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';

export default function ApiKeysPage() {
  const { apiKeys, refreshData, copyToClipboard } = useVerification();
  const { addToast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState('SANDBOX');
  const [loading, setLoading] = useState(false);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      setLoading(true);
      const res = await api.createApiKey({
        name: newKeyName.trim(),
        environment: newKeyEnv,
        rateLimitRps: 100
      });

      if (res.success) {
        addToast({
          title: 'API Key Created',
          message: `Created ${newKeyEnv} key "${newKeyName}".`,
          type: 'success'
        });
        setCreateModalOpen(false);
        setNewKeyName('');
        refreshData();
      }
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.message || 'Failed to create key.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete API Key "${name}"?`)) {
      try {
        await api.revokeApiKey(id);
        addToast({
          title: 'Key Deactivated',
          message: `Key "${name}" is no longer active.`,
          type: 'warning'
        });
        refreshData();
      } catch (err) {
        addToast({
          title: 'Error',
          message: err.message,
          type: 'error'
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              API Keys
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate and manage API keys to connect your systems with Laxmi Niwas verification.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          icon={Plus}
          size="md"
        >
          Create New API Key
        </Button>
      </div>

      {/* Keys List */}
      <div className="space-y-4">
        {apiKeys.map(key => {
          const isLive = key.environment === 'LIVE';
          const isRevoked = key.status === 'REVOKED';

          return (
            <div
              key={key.id}
              className={`bg-white border rounded-2xl p-6 shadow-card transition-all ${
                isRevoked
                  ? 'border-slate-200 opacity-60 bg-slate-50/50'
                  : isLive
                  ? 'border-emerald-200 ring-1 ring-emerald-500/10'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isLive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isLive ? 'LIVE' : 'TEST'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{key.name}</h3>
                      <StatusBadge status={key.status} size="xs" />
                    </div>
                    <span className="text-[11px] text-slate-400">Created on {new Date(key.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {!isRevoked && (
                  <button
                    onClick={() => handleRevokeKey(key.id, key.name)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Key</span>
                  </button>
                )}
              </div>

              {/* Key Row */}
              <div className="pt-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Secret Key
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      {key.maskedKey}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(key.rawKeyPreview || key.maskedKey, 'API Key')}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-brand-700 font-bold flex items-center gap-1.5 text-xs shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New API Key"
        subtitle="Generate a secret key for your application"
      >
        <form onSubmit={handleCreateKey} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Key Name *
            </label>
            <input
              type="text"
              placeholder="e.g. My Website App Key"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewKeyEnv('LIVE')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  newKeyEnv === 'LIVE'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-bold text-slate-900 block text-xs">Live (Production)</span>
                <span className="text-[11px] text-slate-500">Real verification queries</span>
              </button>
              <button
                type="button"
                onClick={() => setNewKeyEnv('SANDBOX')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  newKeyEnv === 'SANDBOX'
                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-bold text-slate-900 block text-xs">Test (Sandbox)</span>
                <span className="text-[11px] text-slate-500">Free demo testing</span>
              </button>
            </div>
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full font-bold"
            >
              Create Key
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
