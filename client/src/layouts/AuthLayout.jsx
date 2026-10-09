import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerLinkText,
  footerLinkTo,
  footerLinkAction
}) {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top back navigation */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CareerLens Home
        </Link>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md space-y-6 bg-white border border-stone-200/90 p-8 rounded-2xl shadow-xl shadow-stone-200/50 relative">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group justify-center mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 group-hover:border-emerald-400 group-hover:bg-emerald-100 transition-all shadow-2xs">
              <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              CareerLens
            </span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Body */}
        {children}

        {/* Footer Link */}
        {footerLinkTo && (
          <div className="pt-4 border-t border-stone-100 text-center text-xs text-slate-600">
            {footerLinkText}{' '}
            <Link
              to={footerLinkTo}
              className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors ml-1"
            >
              {footerLinkAction}
            </Link>
          </div>
        )}
      </div>

      {/* Trust Tag */}
      <p className="mt-8 text-center text-xs text-slate-500">
        AI-Powered Job & Internship Discovery Platform for Students
      </p>
    </div>
  );
}
