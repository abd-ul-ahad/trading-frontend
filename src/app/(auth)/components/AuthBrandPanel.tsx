import Link from 'next/link';

const REGISTER_STEPS = [
  {
    num: 1,
    title: 'Create your account',
    desc: 'Name, email, and password — verified by OTP.',
  },
  {
    num: 2,
    title: 'Browse strategies',
    desc: 'Explore 10+ live-verified strategies with full MT5 equity curves.',
  },
  {
    num: 3,
    title: 'Connect your broker',
    desc: 'Link your MT5 account with read-only credentials. We never trade on your behalf.',
  },
  {
    num: 4,
    title: 'Track live performance',
    desc: 'Watch real P&L, drawdown, and win rate update in real time.',
  },
] as const;

function EquityCard() {
  return (
    <div className="max-w-[380px] rounded-[14px] border border-border bg-secondary p-5">
      <div className="mb-3.5 flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Portfolio equity
          </p>
          <p className="font-outfit text-2xl font-medium tracking-tight text-foreground">
            $108,596
          </p>
        </div>
        <span className="rounded-md border border-success-500/25 bg-success-500/10 px-2 py-1 font-outfit text-[13px] font-medium text-success-500">
          +38.4%
        </span>
      </div>
      <svg
        className="mb-3.5 h-16 w-full"
        viewBox="0 0 340 64"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,52 C20,50 40,47 60,43 S95,36 120,30 S155,21 180,17 S215,13 240,11 S280,9 305,7 S330,5 340,4"
          stroke="rgb(var(--primary))"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M0,52 C20,50 40,47 60,43 S95,36 120,30 S155,21 180,17 S215,13 240,11 S280,9 305,7 S330,5 340,4 L340,64 L0,64Z"
          fill="url(#eqGrad)"
        />
        <circle cx="305" cy="7" r="3.5" fill="rgb(var(--primary))" opacity="0.8" />
      </svg>
      <div className="grid grid-cols-3 gap-0 border-t border-border pt-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Since inception
          </p>
          <p className="font-outfit text-[15px] font-medium text-primary">+187.3%</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Max drawdown
          </p>
          <p className="font-outfit text-[15px] font-medium text-muted-foreground">-8.2%</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Capital
          </p>
          <p className="font-outfit text-[15px] font-medium text-foreground">$4.2M</p>
        </div>
      </div>
    </div>
  );
}

export function AuthBrandPanel({
  variant,
}: {
  variant: 'sign-in' | 'register';
}) {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card px-10 py-12 lg:flex xl:px-[52px]">
      <div
        className="pointer-events-none absolute -left-20 -top-[100px] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[60px] -right-[60px] h-[320px] w-[320px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

        <Link href="/"> 
          <div className="relative z-10">
            <div className="font-display text-2xl tracking-wide gold-text">Oroviax</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Verified Performance
            </div>
          </div>  
        </Link>


      <div className="relative z-10">
        {variant === 'register' ? (
          <>
            <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary/80">
              <span className="h-px w-[18px] bg-primary/80" />
              Get started
            </div>
            <h1 className="font-display mb-4 text-[44px] font-normal leading-[1.12] text-foreground">
              Start following
              <br />
              <em className="text-primary not-italic">verified</em>
              <br />
              strategies today.
            </h1>
            <p className="font-outfit mb-9 max-w-[360px] text-[15px] leading-[1.8] text-muted-foreground">
              Create your free account in under two minutes. Browse live-verified
              trading strategies, connect your broker, and track performance in
              real time.
            </p>
            <div className="flex flex-col gap-4">
              {REGISTER_STEPS.map((step) => (
                <div key={step.num} className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-outfit text-[13px] font-medium text-primary">
                    {step.num}
                  </div>
                  <div>
                    <p className="font-outfit text-[15px] font-medium text-foreground">
                      {step.title}
                    </p>
                    <p className="font-outfit text-[13px] leading-snug text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary/80">
              <span className="h-px w-[18px] bg-primary/80" />
              Live · MT5 Verified
            </div>
            <h1 className="font-display mb-5 text-[48px] font-normal leading-[1.1] text-foreground">
              Where capital meets
              <br />
              <em className="text-primary not-italic">verified</em>
              <br />
              performance.
            </h1>
            <p className="font-outfit mb-10 max-w-[360px] text-[15px] leading-[1.8] text-muted-foreground">
              Every equity curve sourced live from MT5 — unfiltered and
              unadjusted. Choose your risk. Track your returns. No black boxes.
            </p>
            <EquityCard />
          </>
        )}
      </div>

      <div className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-success-500 shadow-[0_0_7px_rgba(76,175,114,0.4)]" />
        {variant === 'register'
          ? 'Live data · MT5 verified · No simulations'
          : 'Live data · Updated every 60 seconds'}
      </div>
    </div>
  );
}
