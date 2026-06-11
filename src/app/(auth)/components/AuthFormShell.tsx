export function AuthFormShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[440px]">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="font-display mt-2 text-[32px] font-normal text-foreground">
        {title}
      </h2>
      {subtitle && (
        <div className="font-outfit mt-2 text-sm text-muted-foreground [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline">
          {subtitle}
        </div>
      )}
      <div className="mt-7">{children}</div>
      {footer && (
        <div className="mt-7 text-center font-mono text-xs tracking-wide text-muted-foreground [&_a]:text-muted-foreground [&_a]:no-underline hover:[&_a]:text-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
