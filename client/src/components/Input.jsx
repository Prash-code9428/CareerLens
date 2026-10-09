import React from 'react';

export default function Input({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
  disabled = false,
  helperText,
  icon: Icon
}) {
  const inputId = id || name;

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-stone-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-stone-300 hover:border-stone-400 focus:border-emerald-600 focus:ring-emerald-500/20'
          }`}
        />
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
