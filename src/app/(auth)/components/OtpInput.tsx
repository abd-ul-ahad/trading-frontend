'use client';

import { useRef, KeyboardEvent, ClipboardEvent } from 'react';

const BOX_IDS = ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'] as const;

export function OtpInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (index: number, digit: string) => {
    const next = [...values];
    next[index] = digit;
    onChange(next);
    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleInput = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = BOX_IDS.map((_, i) => pasted[i] ?? '');
    onChange(next);
    const focusIndex = Math.min(pasted.length, 5);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="my-5 flex justify-center gap-2.5">
      {BOX_IDS.map((id, index) => (
        <input
          key={id}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index] ?? ''}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={[
            'font-outfit h-[62px] w-[56px] rounded-[10px] border bg-card text-center text-2xl font-medium text-foreground outline-none transition-[border-color,box-shadow] caret-primary',
            'focus:border-primary/25 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]',
            values[index]
              ? 'border-success-500/40 text-success-500'
              : 'border-border',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

export function getOtpCode(values: string[]): string {
  return values.join('');
}
