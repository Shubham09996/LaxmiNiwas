import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070B18] flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shadow-glow-indigo mb-4 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs uppercase tracking-widest">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Verifying Security Clearance...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
