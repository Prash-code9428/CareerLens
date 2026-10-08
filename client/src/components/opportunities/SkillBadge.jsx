import React from 'react';
import { Check, AlertTriangle, Tag } from 'lucide-react';

export default function SkillBadge({ skill, type = 'matching' }) {
  if (!skill) return null;

  if (type === 'matching') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
        <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
        <span>{skill}</span>
      </span>
    );
  }

  if (type === 'gap' || type === 'missing') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300">
        <AlertTriangle className="w-3 h-3 text-amber-400 stroke-[2]" />
        <span>{skill}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
      <Tag className="w-3 h-3 text-slate-400" />
      <span>{skill}</span>
    </span>
  );
}
