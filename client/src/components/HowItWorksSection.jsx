import React from 'react';
import { FileUp, UserCheck, Compass, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Upload Your Resume',
    subtitle: 'Fast & Secure',
    description:
      'Upload your resume and let CareerLens understand your experience, skills, projects, and interests.',
    icon: FileUp,
    badge: 'Resume Analysis'
  },
  {
    number: '02',
    title: 'Build Your Career Profile',
    subtitle: 'Structured Understanding',
    description:
      'CareerLens turns your experience into a personalized profile of your strengths and career direction.',
    icon: UserCheck,
    badge: 'Career Profile'
  },
  {
    number: '03',
    title: 'Discover Better-Fit Opportunities',
    subtitle: 'Targeted Discovery',
    description:
      'Explore relevant jobs and internships based on your actual profile instead of manually searching through endless listings.',
    icon: Compass,
    badge: 'Live Opportunities'
  },
  {
    number: '04',
    title: 'Understand Before You Apply',
    subtitle: 'Match & Gap Insights',
    description:
      'See what matches, what skills you may be missing, and why an opportunity could be worth your attention.',
    icon: CheckCircle2,
    badge: 'Smart Compatibility'
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From resume upload to matched opportunity in four steps
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            CareerLens replaces tedious, manual job hunting with an intelligent workflow designed to give you clarity and confidence.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-[#fafaf9] border border-stone-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md hover:shadow-stone-200/60 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-slate-700 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-stone-200/80">
                  <span className="inline-block text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs">
                    {step.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
