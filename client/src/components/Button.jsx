import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:bg-emerald-500 focus:ring-emerald-400 shadow-md shadow-emerald-500/15',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-800 focus:ring-slate-600 border border-slate-700',
    outline: 'bg-transparent text-slate-200 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 focus:ring-slate-700',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 focus:ring-rose-500'
  };

  const isButtonDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 text-current" />}
          {children}
        </>
      )}
    </button>
  );
}
