import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed"
    >
      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
