'use client';

import { forwardRef, useState } from 'react';

type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
  labelExtra?: React.ReactNode;
};

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField(
    {
      id,
      label,
      type = 'text',
      placeholder,
      value,
      onChange,
      error,
      autoComplete,
      showPasswordToggle,
      labelExtra,
    },
    ref
  ) {
    const [visible, setVisible] = useState(false);
    const inputType =
      showPasswordToggle && type === 'password'
        ? visible
          ? 'text'
          : 'password'
        : type;

    return (
      <div className="mb-4">
        {labelExtra ? (
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor={id}
              className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
            >
              {label}
            </label>
            {labelExtra}
          </div>
        ) : (
          <label
            htmlFor={id}
            className="mb-1.5 block font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={[
              'font-outfit w-full rounded-[9px] border bg-card px-4 py-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow]',
              'placeholder:text-muted-foreground/70',
              'focus:border-primary/25 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.07)]',
              showPasswordToggle ? 'pr-10' : '',
              error
                ? 'border-destructive/50 focus:shadow-[0_0_0_3px_rgba(217,85,85,0.08)]'
                : 'border-border',
            ].join(' ')}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 font-outfit text-[13px] text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
