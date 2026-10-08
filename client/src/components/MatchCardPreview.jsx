import React from 'react';
import { CheckCircle2, AlertTriangle, Building2, MapPin, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function MatchCardPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-60" />

      {/* Main Opportunity Card */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 text-left">
        {/* Card Header with Match Score */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Strong Match
            </span>
            <h3 className="text-xl font-bold text-white pt-1">
              Software Engineer Intern
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Apex Labs
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Remote / Bangalore
              </span>
            </div>
          </div>

          {/* Radial-like Match Score Badge */}
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shrink-0">
            <span className="text-xl font-black tracking-tight">94%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/80">Match</span>
          </div>
        </div>

        {/* AI Fit Analysis Summary */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vertex AI Fit Analysis</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            High alignment with full-stack projects in your resume. Strong proficiency in backend APIs and component design.
          </p>
        </div>

        {/* Skill Comparison Breakdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Skill Alignment</span>
            <span className="text-slate-500">3 matched, 1 gap</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>React</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Node.js</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>MongoDB</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>TypeScript</span>
            </div>
          </div>
        </div>

        {/* Actions Preview */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 italic">
            Illustrative UI only, not real job data
          </span>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium cursor-not-allowed opacity-90"
          >
            Apply Directly
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
