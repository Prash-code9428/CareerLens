import React from 'react';
import { X, Check, Search, ShieldCheck, Zap } from 'lucide-react';

const TRADITIONAL_PAIN_POINTS = [
  'Searching across multiple scattered platforms and boards',
  'Reading dozens of long, repetitive job descriptions',
  'Guessing whether you qualify for roles with ambiguous requirements',
  'Uncertainty about which specific skills you are missing'
];

const CAREERLENS_BENEFITS = [
  'One structured career profile built from your resume',
  'Relevant, personalized opportunities in one place',
  'Clear compatibility scores and objective matching',
  'Visible skill gaps so you know exactly what to learn'
];

export default function WhySection() {
  return (
    <section id="why-careerlens" className="py-20 md:py-28 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            Why CareerLens
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Search less. Understand more. Apply with confidence.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            CareerLens is built to eliminate the guesswork from placement preparation and connect who you are with where you can succeed.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Traditional Way */}
          <div className="rounded-2xl bg-[#fafaf9] border border-stone-200/90 p-8 space-y-6">
            <div className="space-y-1.5 pb-4 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Traditional Job Search
              </span>
              <h3 className="text-xl font-bold text-slate-800">
                Manual, Fragmented & Uncertain
              </h3>
            </div>

            <ul className="space-y-4">
              {TRADITIONAL_PAIN_POINTS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CareerLens Way */}
          <div className="rounded-2xl bg-emerald-50/40 border border-emerald-200/90 p-8 space-y-6 shadow-sm shadow-emerald-900/5">
            <div className="space-y-1.5 pb-4 border-b border-emerald-200/70">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                The CareerLens Approach
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Personalized, Clear & Focused
              </h3>
            </div>

            <ul className="space-y-4">
              {CAREERLENS_BENEFITS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 font-medium leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
