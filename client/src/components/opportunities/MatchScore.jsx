import React from 'react';
import { Zap } from 'lucide-react';

export default function MatchScore({ score, recommendation, size = 'default' }) {
  const numericScore = typeof score === 'number' ? Math.round(score) : null;

  const getStyle = (rec, val) => {
    const effectiveScore = val ?? 0;
    if (rec === 'Strong Match' || effectiveScore >= 85) {
      return {
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        scoreText: 'text-emerald-400',
        dot: 'bg-emerald-400',
        glow: 'shadow-emerald-500/20'
      };
    }
    if (rec === 'Good Match' || effectiveScore >= 70) {
      return {
        badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        scoreText: 'text-cyan-400',
        dot: 'bg-cyan-400',
        glow: 'shadow-cyan-500/20'
      };
    }
    if (rec === 'Possible Match' || effectiveScore >= 50) {
      return {
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        scoreText: 'text-amber-400',
        dot: 'bg-amber-400',
        glow: 'shadow-amber-500/20'
      };
    }
    return {
      badgeBg: 'bg-slate-800/80 border-slate-700 text-slate-400',
      scoreText: 'text-slate-400',
      dot: 'bg-slate-500',
      glow: 'shadow-transparent'
    };
  };

  const style = getStyle(recommendation, numericScore);

  return (
    <div className="flex items-center gap-2">
      {numericScore !== null && (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 shadow-sm ${style.glow}`}>
          <Zap className={`w-3.5 h-3.5 ${style.scoreText}`} />
          <span className={`text-sm font-extrabold ${style.scoreText}`}>
            {numericScore}%
          </span>
        </div>
      )}

      {recommendation && (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${style.badgeBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
          <span>{recommendation}</span>
        </div>
      )}
    </div>
  );
}
