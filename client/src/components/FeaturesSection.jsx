import React from 'react';
import { FileText, Compass, BarChart3, AlertCircle, MessageSquareText, SlidersHorizontal } from 'lucide-react';

const FEATURES = [
  {
    icon: FileText,
    title: 'Resume Intelligence',
    description:
      'Understand your skills, projects, experience, and career profile directly from your uploaded resume.'
  },
  {
    icon: Compass,
    title: 'Personalized Discovery',
    description:
      'Find opportunities aligned with your background, career interests, and preferred job locations.'
  },
  {
    icon: BarChart3,
    title: 'Smart Matching',
    description:
      'Understand how closely an opportunity fits your current profile with clear compatibility scores.'
  },
  {
    icon: AlertCircle,
    title: 'Skill Gap Insights',
    description:
      'See which skills align with an opportunity and where you may need to learn or improve.'
  },
  {
    icon: MessageSquareText,
    title: 'Clear Recommendations',
    description:
      'Get a clear, transparent explanation of why an opportunity may or may not be a good fit for you.'
  },
  {
    icon: SlidersHorizontal,
    title: 'Focused Search',
    description:
      'Filter and sort opportunities by work mode, job type, and match score so you spend less time searching and more time applying.'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#fafaf9] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for thoughtful placement preparation
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every capability in CareerLens is focused on giving you clarity, saving your time, and helping you apply with confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-stone-200/90 p-7 space-y-4 hover:border-emerald-300 hover:shadow-md hover:shadow-stone-200/60 transition-all hover:translate-y-[-2px]"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
