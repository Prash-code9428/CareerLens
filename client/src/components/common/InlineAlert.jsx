import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X, RefreshCw } from 'lucide-react';

export default function InlineAlert({
  type = 'error', // error, success, warning, info
  message,
  onClose,
  onRetry,
  className = ''
}) {
  if (!message) return null;

  const config = {
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
    },
    info: {
      bg: 'bg-cyan-50 border-cyan-200 text-cyan-800',
      icon: <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
    }
  }[type] || {
    bg: 'bg-stone-100 border-stone-200 text-slate-700',
    icon: <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
  };

  return (
    <div
      className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${config.bg} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-2.5 flex-1">
        {config.icon}
        <span className="leading-relaxed">{message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 text-xs font-semibold underline hover:opacity-80 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
