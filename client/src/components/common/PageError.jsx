import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

export default function PageError({
  title = 'Something went wrong',
  message = 'We encountered an unexpected issue. Please try again.',
  onRetry,
  backTo = '/dashboard',
  backLabel = 'Back to Dashboard'
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 space-y-6 shadow-2xl shadow-slate-950/80">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:bg-emerald-500 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          <Link
            to={backTo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
