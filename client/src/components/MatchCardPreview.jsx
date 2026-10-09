import React from 'react';
import { FileText, Compass, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';

export default function MatchCardPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Soft warm shadow card */}
      <div className="relative rounded-2xl bg-white border border-stone-200/90 p-6 shadow-xl shadow-stone-200/50 space-y-5 text-left">
        
        {/* Top Header: Candidate Career Profile */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Your Career Profile
              </h4>
              <p className="text-[11px] text-emerald-700 font-medium">
                Structured from Resume
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Profile Ready
          </span>
        </div>

        {/* Profile Attributes Snapshot */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Key Strengths & Competencies
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-slate-700 text-xs font-medium">
                Full-Stack Architecture
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-slate-700 text-xs font-medium">
                REST & API Design
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-slate-700 text-xs font-medium">
                Database Systems
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Target Directions
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
                Software Engineering
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
                Web Development
              </span>
            </div>
          </div>
        </div>

        {/* Discovery & Insight Preview Box */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              Live Opportunity Matching
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Real-time Analysis
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/70 text-slate-700">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Matching Qualifications</span>
              </span>
              <span className="text-emerald-700 font-semibold text-[11px]">Identified</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/70 text-slate-700">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Skill Gap & Prerequisites</span>
              </span>
              <span className="text-teal-700 font-semibold text-[11px]">Highlighted</span>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>CareerLens Intelligent Preview</span>
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
            Automated alignment <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>
    </div>
  );
}
