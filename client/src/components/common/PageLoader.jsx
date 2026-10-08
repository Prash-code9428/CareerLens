import React from 'react';
import { Compass, Loader2 } from 'lucide-react';

export default function PageLoader({ message = 'Loading CareerLens...' }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse shadow-lg shadow-emerald-500/10">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin absolute -bottom-1 -right-1" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-white tracking-wide">{message}</p>
        <p className="text-xs text-slate-500">Please wait while we securely prepare your session</p>
      </div>
    </div>
  );
}
