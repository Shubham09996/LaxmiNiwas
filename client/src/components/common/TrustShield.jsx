import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function TrustShield({ score = 99.4 }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold text-xs">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      <span>{score}% Match</span>
    </div>
  );
}
