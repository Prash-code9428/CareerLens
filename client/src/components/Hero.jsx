import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import MatchCardPreview from './MatchCardPreview.jsx';

export default function Hero() {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-[#fafaf9] border-b border-stone-200/70">
      {/* Subtle warm background accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Value Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Intelligent Career Discovery</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Stop searching.{' '}
                <span className="text-emerald-700">
                  Start matching.
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-700">
                Find opportunities that fit you.
              </p>
            </div>

            {/* Explanatory Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              CareerLens understands your resume, discovers relevant jobs and internships, and helps you understand which opportunities align with your skills and experience.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-700/15 text-base"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-stone-50 border border-stone-200/90 hover:border-stone-300 shadow-2xs transition-all text-base cursor-pointer"
              >
                See How It Works
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No manual filtering needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Clear skill-gap breakdowns
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Direct application links
              </span>
            </div>
          </div>

          {/* Right Column: Visual Product Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <MatchCardPreview />
          </div>

        </div>
      </div>
    </section>
  );
}
