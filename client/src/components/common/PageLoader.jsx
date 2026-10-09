import React from 'react';
import { Compass, Loader2 } from 'lucide-react';

export default function PageLoader({ message = 'Loading CareerLens...' }) {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 animate-pulse shadow-md shadow-emerald-700/10">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin absolute -bottom-1 -right-1" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-slate-900 tracking-wide">{message}</p>
        <p className="text-xs text-slate-500">Please wait while we securely prepare your session</p>
      </div>
    </div>
  );
}
