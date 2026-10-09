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
      <div className="rounded-2xl bg-rose-50 border border-rose-200 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900">Discovery Search Failed</h3>
          <p className="text-xs sm:text-sm text-rose-700 max-w-md mx-auto">
            {errorMessage || 'Unable to retrieve live opportunities at this moment. Please check your connection or try again.'}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white border border-stone-200 text-slate-700 hover:text-slate-900 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
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
      <div className="rounded-2xl bg-white border border-stone-200/90 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-500">
          <Briefcase className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900">No Live Opportunities Found</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            We searched live hiring portals with Vertex AI queries but found no active listings matching your current criteria.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 shadow-2xs transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Update Career Preferences</span>
          </Link>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
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
      <div className="rounded-2xl bg-white border border-stone-200/90 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900">Complete Your Candidate Profile First</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            To discover and match opportunities accurately, upload your resume PDF or fill out your skills and target role preferences.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-700/15"
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
    <div className="rounded-2xl bg-white border border-stone-200/90 p-8 sm:p-14 text-center space-y-6 max-w-3xl mx-auto shadow-sm">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-slate-900">
          Ready to discover live opportunities
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Google Cloud Vertex AI will generate focused web queries based on your extracted skills and target roles, searching Context.dev for active listings and evaluating each match in real-time.
        </p>
      </div>

      <div className="pt-2">
        <SearchButton onClick={onRetry} />
      </div>

      <div className="pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">1. Live Web Search</p>
          <p className="text-xs text-slate-600">Context.dev queries actual hiring portals & company career sites.</p>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">2. Real-Time Scoring</p>
          <p className="text-xs text-slate-600">Vertex AI calculates match percentage and categorizes match strength.</p>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-800">3. Skill Breakdown</p>
          <p className="text-xs text-slate-600">Identifies matching competencies and honest skill gaps without fluff.</p>
        </div>
      </div>
    </div>
  );
}
