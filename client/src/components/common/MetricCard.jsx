import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ title, value, delta, isPositive = true, subtitle, icon: Icon, color = 'emerald' }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-sky-50 text-sky-700 border-sky-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  const bgIconClass = colorMap[color] || colorMap.emerald;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all relative overflow-hidden group">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-sans tracking-tight tnum">
              {value}
            </span>
            {delta && (
              <span className={`inline-flex items-center text-xs font-semibold tnum ${isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {delta}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${bgIconClass} group-hover:scale-105 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
