import React from 'react';
import { Zap } from 'lucide-react';

export default function MatchScore({ score, recommendation, size = 'default' }) {
  const numericScore = typeof score === 'number' ? Math.round(score) : null;

  const getStyle = (rec, val) => {
    const effectiveScore = val ?? 0;
    if (rec === 'Strong Match' || effectiveScore >= 85) {
      return {
        badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        scoreText: 'text-emerald-700',
        dot: 'bg-emerald-600',
        glow: 'shadow-2xs'
      };
    }
    if (rec === 'Good Match' || effectiveScore >= 70) {
      return {
        badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
        scoreText: 'text-teal-700',
        dot: 'bg-teal-600',
        glow: 'shadow-2xs'
      };
    }
    if (rec === 'Possible Match' || effectiveScore >= 50) {
      return {
        badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
        scoreText: 'text-amber-700',
        dot: 'bg-amber-600',
        glow: 'shadow-2xs'
      };
    }
    return {
      badgeBg: 'bg-stone-100 border-stone-200 text-slate-600',
      scoreText: 'text-slate-600',
      dot: 'bg-slate-400',
      glow: 'shadow-none'
    };
  };

  const style = getStyle(recommendation, numericScore);

  return (
    <div className="flex items-center gap-2">
      {numericScore !== null && (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 shadow-2xs ${style.glow}`}>
          <Zap className={`w-3.5 h-3.5 ${style.scoreText}`} />
          <span className={`text-sm font-extrabold ${style.scoreText}`}>
            {numericScore}%
          </span>
        </div>
      )}

      {recommendation && (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${style.badgeBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          <span>{recommendation}</span>
        </div>
      )}
    </div>
  );
}
