import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Visual3DCard from '../3d/Visual3DCard.jsx';
import { useNavigate } from 'react-router-dom';

export default function QuickTestModal({ apiItem, isOpen, onClose }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [inputParams, setInputParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (apiItem) {
      setInputParams(apiItem.sampleInput || {});
      setResult(null);
      setError('');
    }
  }, [apiItem]);

  const runExecution = async (params) => {
    if (!apiItem) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.testApi(apiItem.id, params);
      setResult(res);
      if (!res.success) {
        setError(res.error || 'Upstream gateway returned an error.');
      }
    } catch (err) {
      setError(err.message || 'Error running test query.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (k, val) => {
    setInputParams(prev => ({ ...prev, [k]: val }));
  };

  if (!isOpen || !apiItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/85 backdrop-blur-xl p-4 sm:p-6 md:p-8 flex justify-center items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, type: 'spring', stiffness: 220, damping: 25 }}
          className="relative w-full max-w-5xl xl:max-w-6xl bg-[#0B1020] border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto ring-4 ring-indigo-500/10"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-mono font-extrabold text-sm shadow-glow-indigo flex-shrink-0">
                #{apiItem.num < 10 ? `0${apiItem.num}` : apiItem.num}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {apiItem.name}
                  </h3>
                  <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 whitespace-nowrap">
                    ₹ {apiItem.cost.toFixed(2)} <span className="text-[10px] text-emerald-300 font-normal">incl. 18% GST</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live Interactive Statutory Sandbox
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/test?api=${apiItem.id}`);
                }}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
              >
                <span>Full Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 flex items-center justify-center transition-all shadow-sm hover:scale-105"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Controls & 3D Output */}
          <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Inputs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Description
                </span>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  {apiItem.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block mb-2.5">
                  Test Query Parameters
                </span>
                <div className="space-y-3">
                  {Object.entries(inputParams).map(([k, val]) => (
                    <div key={k}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        {k.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <input
                        type="text"
                        value={Array.isArray(val) ? val.join(', ') : val}
                        onChange={(e) => handleInputChange(k, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-mono font-bold text-white focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={() => runExecution(inputParams)}
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-glow-indigo flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Querying Gateway...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Verification Query</span>
                  </>
                )}
              </button>
            </div>

            {/* Right 3D Response Display (7 cols) */}
            <div className="lg:col-span-7">
              {result ? (
                <Visual3DCard result={result} />
              ) : (
                <div className="p-16 border-2 border-dashed border-slate-800 rounded-3xl text-center bg-slate-950/40">
                  <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <span className="text-xs text-slate-400 font-bold">Executing test query...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
