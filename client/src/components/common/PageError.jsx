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
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl bg-white border border-stone-200/90 p-8 sm:p-10 space-y-6 shadow-xl shadow-stone-200/50">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-700/15 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          <Link
            to={backTo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-stone-50 text-slate-700 border border-stone-200 hover:border-stone-300 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
