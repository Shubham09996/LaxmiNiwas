import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm', showIcon = true }) {
  const normalized = (status || '').toUpperCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;
  let label = 'Pending';

  if (normalized === 'CERTIFIED' || normalized === 'VALIDATED' || normalized === 'ACTIVE' || normalized === 'SUCCESS') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10';
    Icon = CheckCircle2;
    label = 'Verified';
  } else if (normalized === 'PENDING') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/10';
    Icon = Clock;
    label = 'In Progress';
  } else if (normalized === 'MANUAL_REVIEW' || normalized === 'REVIEW') {
    bg = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/10';
    Icon = AlertTriangle;
    label = 'Review Needed';
  } else if (normalized === 'FAILED' || normalized === 'REVOKED') {
    bg = 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-600/10';
    Icon = XCircle;
    label = normalized === 'REVOKED' ? 'Revoked' : 'Failed';
  }

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-2 py-0.5 gap-1 font-semibold'
    : size === 'lg'
    ? 'text-xs px-3 py-1.5 gap-1.5 font-bold'
    : 'text-[11px] px-2.5 py-0.5 gap-1.5 font-bold';

  return (
    <span className={`inline-flex items-center rounded-full border ${bg} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
}
