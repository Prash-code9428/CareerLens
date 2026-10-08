import React from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

export default function SearchButton({
  onClick,
  loading = false,
  disabled = false,
  hasSearched = false,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:from-emerald-300 hover:to-cyan-300 active:from-emerald-500 active:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 transition-all duration-200 cursor-pointer ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          <span>Discovering Opportunities...</span>
        </>
      ) : (
        <>
          {hasSearched ? (
            <Sparkles className="w-4 h-4 text-slate-950" />
          ) : (
            <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          )}
          <span>{hasSearched ? 'Refresh Opportunities' : 'Find Opportunities'}</span>
        </>
      )}
    </button>
  );
}
