const STEPS = ['Account', 'Verify email', 'Done'] as const;

export function RegisterProgress({
  step,
  visible,
}: {
  step: 1 | 2 | 3;
  visible: boolean;
}) {
  if (!visible) return null;

  const fillWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%';

  return (
    <div className="mb-7">
      <div className="mb-1.5 flex justify-between">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const isDone = n < step;
          const isActive = n === step;
          return (
            <span
              key={label}
              className={[
                'font-mono text-xs uppercase tracking-wide transition-colors',
                isDone
                  ? 'text-success-500'
                  : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground',
              ].join(' ')}
            >
              {label}
            </span>
          );
        })}
      </div>
      <div className="h-[3px] overflow-hidden rounded bg-border">
        <div
          className="h-full rounded bg-gradient-to-r from-primary/70 to-primary transition-[width] duration-300"
          style={{ width: fillWidth }}
        />
      </div>
    </div>
  );
}
