import React from 'react';
import { Layers, Clock, HelpCircle, AlertCircle, FileX } from 'lucide-react';

const PAIN_POINTS = [
  {
    icon: Layers,
    title: 'Fragmented Platforms',
    description:
      'Internships and graduate roles are scattered across dozens of company portals, job boards, and forums, forcing students into repetitive, fragmented searches.'
  },
  {
    icon: Clock,
    title: 'Time-Intensive Searches',
    description:
      'Students spend hours daily reading long job descriptions, filtering outdated listings, and tracking requirements instead of preparing for interviews.'
  },
  {
    icon: HelpCircle,
    title: 'Eligibility Uncertainty',
    description:
      'Vague requirements and convoluted job descriptions make it difficult for students to determine whether their background actually meets the role criteria.'
  },
  {
    icon: AlertCircle,
    title: 'Hidden Skill Gaps',
    description:
      'Job postings rarely make it clear what specific technical skills a candidate lacks, leaving applicants uncertain about what to study or improve.'
  },
  {
    icon: FileX,
    title: 'Mismatched Applications',
    description:
      'Without clear alignment insights, students frequently submit applications to roles where they are under- or over-qualified, resulting in wasted effort and fatigue.'
  }
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            The Student Pain Point
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why placement & internship discovery is broken
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            During placement season, information overload and manual evaluation create unnecessary friction, anxiety, and lost opportunities.
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAIN_POINTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#fafaf9] border border-stone-200/90 p-6 space-y-4 hover:border-emerald-300 hover:shadow-md hover:shadow-stone-200/60 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}

          {/* Solution Contrast Card */}
          <div className="rounded-2xl bg-emerald-50/40 border border-emerald-200/90 p-6 space-y-4 flex flex-col justify-between shadow-sm shadow-emerald-900/5">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                The CareerLens Approach
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Precision Matching, Zero Guesswork
              </h3>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                By deeply analyzing your actual resume and cross-referencing real-time listings with Vertex AI, CareerLens turns hours of blind searching into targeted discovery.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-emerald-700">
              Focus your energy where you have the highest probability of success.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
