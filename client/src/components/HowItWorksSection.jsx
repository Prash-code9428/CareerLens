import React from 'react';
import { FileUp, Cpu, Globe, CheckSquare, ArrowDown, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Upload Resume',
    subtitle: 'Secure Storage',
    description:
      'Upload your PDF resume. It is securely stored in Supabase Storage and prepped for structured entity extraction.',
    icon: FileUp,
    badge: 'Supabase Storage'
  },
  {
    number: '02',
    title: 'Understand Your Skills',
    subtitle: 'Vertex AI Intelligence',
    description:
      'Google Cloud Vertex AI parses your projects, technical skills, coursework, and experience into a high-precision candidate profile.',
    icon: Cpu,
    badge: 'Google Cloud Vertex AI'
  },
  {
    number: '03',
    title: 'Research Opportunities',
    subtitle: 'Live Web Research',
    description:
      'Personalized queries generated from your profile feed into Context.dev to discover verified, real-time job and internship postings.',
    icon: Globe,
    badge: 'Context.dev Web Research'
  },
  {
    number: '04',
    title: 'Match & Recommend',
    subtitle: 'Actionable Insights',
    description:
      'Vertex AI compares live role requirements against your profile, delivering quantitative fit scores, matched skills, and gap analysis.',
    icon: CheckSquare,
    badge: 'Personalized Fit Analysis'
  }
];

const FLOW_NODES = [
  { label: 'Resume', sub: 'PDF document' },
  { label: 'Vertex AI', sub: 'Profile Extraction' },
  { label: 'Candidate Profile', sub: 'Structured schema' },
  { label: 'Context.dev', sub: 'Live web intelligence' },
  { label: 'Live Opportunities', sub: 'Current job listings' },
  { label: 'Vertex AI', sub: 'Fit & Gap Analysis' },
  { label: 'Personalized Matches', sub: 'Scores & recommendations' }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From resume upload to verified match in 4 steps
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            CareerLens combines Google Cloud Vertex AI and Context.dev to replace blind job hunting with evidence-backed matching.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:bg-slate-800/80 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400/90 mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80">
                  <span className="inline-block text-[11px] font-medium text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    {step.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Architecture Flow Diagram */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              System Matching Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end data pipeline powering candidate recommendations
            </p>
          </div>

          {/* Desktop Flow (horizontal) */}
          <div className="hidden lg:flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {FLOW_NODES.map((node, i) => (
              <React.Fragment key={i}>
                <div className="flex-1 min-w-[130px] rounded-xl bg-slate-950 border border-slate-800 p-3 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-200">
                    {node.label}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium truncate">
                    {node.sub}
                  </div>
                </div>

                {i < FLOW_NODES.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Flow (vertical) */}
          <div className="flex lg:hidden flex-col items-center space-y-2">
            {FLOW_NODES.map((node, i) => (
              <React.Fragment key={i}>
                <div className="w-full max-w-sm rounded-xl bg-slate-950 border border-slate-800 p-3 text-center space-y-0.5">
                  <div className="text-sm font-bold text-slate-200">
                    {node.label}
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">
                    {node.sub}
                  </div>
                </div>

                {i < FLOW_NODES.length - 1 && (
                  <ArrowDown className="w-4 h-4 text-slate-600 my-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
