import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed"
    >
      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
