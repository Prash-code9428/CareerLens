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
    <section id="problem" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            The Student Pain Point
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why placement & internship discovery is broken
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
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
                className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}

          {/* Solution Contrast Card */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                The CareerLens Approach
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Precision Matching, Zero Guesswork
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                By deeply analyzing your actual resume and cross-referencing real-time listings with Vertex AI, CareerLens turns hours of blind searching into targeted discovery.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-emerald-400">
              Focus your energy where you have the highest probability of success.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
