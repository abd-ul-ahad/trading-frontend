'use client';

const COLORS = [
  'bg-destructive',
  'bg-warning-500',
  'bg-primary',
  'bg-success-500',
] as const;

const LABELS = ['Weak', 'Fair', 'Good', 'Strong'] as const;

function scorePassword(value: string): number {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

export function PasswordStrength({ value }: { value: string }) {
  const score = scorePassword(value);
  const colorClass = score > 0 ? COLORS[score - 1] : '';
  const label = score > 0 ? LABELS[score - 1] : '';

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={[
              'h-[3px] flex-1 rounded-sm transition-colors',
              i < score ? colorClass : 'bg-border',
            ].join(' ')}
          />
        ))}
      </div>
      {value.length > 0 && (
        <p
          className={[
            'mt-1 font-outfit text-xs transition-colors',
            score === 1
              ? 'text-destructive'
              : score === 2
                ? 'text-warning-500'
                : score === 3
                  ? 'text-primary'
                  : 'text-success-500',
          ].join(' ')}
        >
          {label}
        </p>
      )}
    </div>
  );
}
