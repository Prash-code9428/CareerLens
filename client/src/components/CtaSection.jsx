import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#fafaf9] via-stone-50 to-stone-100/70 border-t border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Intelligent Career Discovery</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Stop searching. <span className="text-emerald-700">Start matching.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and let CareerLens discover relevant opportunities tailored to your actual skills and experience.
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-700/10 text-base"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium text-slate-700 bg-white hover:bg-stone-100 border border-stone-200 transition-all text-base"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    </section>
  );
}

