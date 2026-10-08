import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xl mb-2">
            <Compass className="w-6 h-6" />
            CareerLens
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="text-sm text-slate-400">
            Start matching your profile with verified opportunities
          </p>
        </div>

        {/* Placeholder Notice */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <UserPlus className="w-4 h-4" />
            <span>Registration Flow</span>
          </div>
          <p>
            Student registration and onboarding are scheduled for the next implementation phase.
          </p>
        </div>

        {/* Back link */}
        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
