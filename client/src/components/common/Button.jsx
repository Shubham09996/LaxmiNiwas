import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm ring-1 ring-brand-700/20 shadow-brand-600/10',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300',
    outline: 'bg-transparent hover:bg-brand-50 text-brand-700 border border-brand-300',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg',
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs px-4 py-2 gap-2 font-semibold',
    lg: 'text-sm px-5 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
