import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  AlertCircle,
  RefreshCw,
  Search,
  UserCheck,
  FileText,
  Briefcase
} from 'lucide-react';
import SearchButton from './SearchButton.jsx';

export default function EmptyState({
  type = 'before_search',
  errorMessage = '',
  onRetry,
  hasProfile = true
}) {
  if (type === 'error') {
    return (
      <div className="rounded-2xl bg-rose-500/5 border border-rose-500/20 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white">Discovery Search Failed</h3>
          <p className="text-xs sm:text-sm text-rose-300 max-w-md mx-auto">
            {errorMessage || 'Unable to retrieve live opportunities at this moment. Please check your connection or try again.'}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Discovery</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (type === 'no_results') {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
          <Briefcase className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white">No Live Opportunities Found</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            We searched live hiring portals with Vertex AI queries but found no active listings matching your current criteria.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Update Career Preferences</span>
          </Link>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white">Complete Your Candidate Profile First</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            To discover and match opportunities accurately, upload your resume PDF or fill out your skills and target role preferences.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upload Resume on Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Before search state
  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 p-8 sm:p-14 text-center space-y-6 max-w-3xl mx-auto">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-white">
          Ready to discover live opportunities
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Google Cloud Vertex AI will generate focused web queries based on your extracted skills and target roles, searching Context.dev for active listings and evaluating each match in real-time.
        </p>
      </div>

      <div className="pt-2">
        <SearchButton onClick={onRetry} />
      </div>

      <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">1. Live Web Search</p>
          <p className="text-xs text-slate-400">Context.dev queries actual hiring portals & company career sites.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">2. Real-Time Scoring</p>
          <p className="text-xs text-slate-400">Vertex AI calculates match percentage and categorizes match strength.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-400">3. Skill Breakdown</p>
          <p className="text-xs text-slate-400">Identifies matching competencies and honest skill gaps without fluff.</p>
        </div>
      </div>
    </div>
  );
}
