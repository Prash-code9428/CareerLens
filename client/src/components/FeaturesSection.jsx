import React from 'react';
import { FileText, Compass, BarChart3, AlertCircle, MessageSquareText } from 'lucide-react';

const FEATURES = [
  {
    icon: FileText,
    title: 'Resume-Aware Matching',
    description:
      'Rather than relying on keywords or self-reported checkboxes, our model evaluates your complete educational background, technical projects, and coursework.'
  },
  {
    icon: Compass,
    title: 'Live Opportunity Discovery',
    description:
      'Integrated with Context.dev web research to discover live, active internships and entry-level positions directly from company career sites and verified sources.'
  },
  {
    icon: BarChart3,
    title: 'AI Match Scores',
    description:
      'Transparent fit scores provide an objective benchmark of how closely your technical skill set matches the job requirements.'
  },
  {
    icon: AlertCircle,
    title: 'Skill-Gap Identification',
    description:
      'Pinpoints the precise technologies or prerequisites you are missing, so you know exactly what to study before interviewing.'
  },
  {
    icon: MessageSquareText,
    title: 'Personalized Explanations',
    description:
      'Clear, written breakdowns explain why a role was recommended and provide tailored context to boost your application confidence.'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed specifically for student placement preparation
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Every feature in CareerLens is engineered to minimize searching time and maximize your application clarity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-all hover:translate-y-[-2px]"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
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
