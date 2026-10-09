import React from 'react';
import { Check, AlertTriangle, Tag } from 'lucide-react';

export default function SkillBadge({ skill, type = 'matching' }) {
  if (!skill) return null;

  if (type === 'matching') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
        <span>{skill}</span>
      </span>
    );
  }

  if (type === 'gap' || type === 'missing') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800">
        <AlertTriangle className="w-3 h-3 text-amber-600 stroke-[2]" />
        <span>{skill}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-stone-100 border border-stone-200 text-slate-700">
      <Tag className="w-3 h-3 text-slate-500" />
      <span>{skill}</span>
    </span>
  );
}
