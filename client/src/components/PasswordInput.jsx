import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
  id,
  name,
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••',
  error,
  required = false,
  autoComplete = 'current-password',
  disabled = false,
  helperText
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      </div>

      <div className="relative rounded-xl shadow-2xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full rounded-xl bg-white border pl-9 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-stone-300 hover:border-stone-400 focus:border-emerald-600 focus:ring-emerald-500/20'
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50 cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-rose-600 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
