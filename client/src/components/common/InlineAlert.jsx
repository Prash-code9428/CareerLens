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
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
    },
    info: {
      bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
      icon: <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
    }
  }[type] || {
    bg: 'bg-slate-800 border-slate-700 text-slate-300',
    icon: <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
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
            className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
