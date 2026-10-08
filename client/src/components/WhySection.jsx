import React from 'react';
import { UserCheck, Search, Cpu, Check, Plus } from 'lucide-react';

export default function WhySection() {
  const PILLARS = [
    {
      icon: UserCheck,
      title: 'Deep Candidate Understanding',
      description:
        'Analyzes projects, skill proficiency, and coursework directly from your actual resume document to form a rich, structured profile.'
    },
    {
      icon: Search,
      title: 'Live Opportunity Research',
      description:
        'Leverages Context.dev to search live web data and identify active, relevant internship and job openings rather than static old databases.'
    },
    {
      icon: Cpu,
      title: 'Evidence-Based AI Matching',
      description:
        'Uses Google Cloud Vertex AI to systematically evaluate technical overlap, highlight skill gaps, and quantify job fit.'
    }
  ];

  return (
    <section id="why-careerlens" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Why CareerLens
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Matching intelligence, not just another job list
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Conventional portals focus merely on indexing posts. CareerLens bridges the gap between who you are and what the market demands.
          </p>
        </div>

        {/* 3 Pillars Formula */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-12">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl bg-slate-900 border border-slate-800 p-8 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Integrated into one platform</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-8 text-center max-w-4xl mx-auto">
          <div className="text-slate-300 text-sm sm:text-base leading-relaxed">
            By unifying <strong className="text-white">Candidate Understanding</strong>, <strong className="text-white">Live Opportunity Research</strong>, and <strong className="text-white">AI Matching</strong>, CareerLens empowers students to approach placement preparation with confidence and clarity.
          </div>
        </div>

      </div>
    </section>
  );
}
