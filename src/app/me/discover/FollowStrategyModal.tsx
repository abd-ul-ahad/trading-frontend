'use client';

import { useEffect, useState } from 'react';
import { StrategyListItem } from '@/lib/api/strategyApi';

const RECOMMENDED_BROKER = 'Vantage Markets';

type Step = 1 | 2 | 3 | 4 | 5;

function ProgressDots({ active }: { active: number }) {
  return (
    <div className="mb-5 flex items-center gap-1.5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={[
            'h-2 rounded-full transition-all duration-300',
            i < active
              ? 'w-2 bg-[#4CAF72]'
              : i === active
                ? 'w-[22px] rounded bg-primary'
                : 'w-2 bg-[#2E2E28]',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 font-outfit text-[10px] leading-snug text-[#48463E]">
      <span className="mt-px inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#48463E] text-[9px]">
        i
      </span>
      {children}
    </p>
  );
}

export function FollowStrategyModal({
  strategy,
  open,
  onClose,
}: {
  strategy: StrategyListItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [accountName, setAccountName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');

  useEffect(() => {
    if (open) {
      setStep(1);
      setAccountName('');
      setLoginId('');
      setPassword('');
      setServer('');
    }
  }, [open, strategy?.publicCode]);

  if (!open || !strategy) return null;

  const subtitle =
    step === 1
      ? "What you'll need before you start"
      : step === 2
        ? 'Step 2 of 4 — Account details'
        : step === 3
          ? 'Step 3 of 4 — Broker access'
          : step === 4
            ? 'Step 4 of 4 — Review & confirm'
            : 'Submission received';

  const goStep2 = () => {
    if (!accountName.trim() || !loginId.trim()) return;
    setStep(3);
  };

  const goStep3 = () => {
    if (!password || !server.trim()) return;
    setStep(4);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/82 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="follow-modal-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-[450px] flex-col overflow-hidden rounded-2xl border border-primary/25 bg-[#131310]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#252520] bg-[#131310] px-6 pb-4 pt-5">
          <div>
            <h2
              id="follow-modal-title"
              className="font-display text-xl text-[#EDE9E0]"
            >
              Follow {strategy.displayName}
            </h2>
            <p className="mt-1 font-outfit text-[11px] text-[#7A7870]">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent p-0 font-outfit text-[22px] leading-none text-[#7A7870] transition-colors hover:text-[#EDE9E0]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <>
              <ProgressDots active={1} />
              <div className="mb-3.5 flex flex-col gap-2">
                {[
                  {
                    icon: '#',
                    title: 'MT5 Account Name',
                    desc: 'A label to identify this account — only visible to you',
                  },
                  {
                    icon: '@',
                    title: 'MT5 Login ID',
                    desc: 'Your numeric login from your broker (e.g. 123456789)',
                  },
                  {
                    icon: '🔒',
                    title: 'Read-Only (Investor) Password',
                    desc: 'Found in MT5 under Tools → Options → Investor tab',
                  },
                  {
                    icon: '⚡',
                    title: 'MT5 Server Name',
                    desc: 'Shown on the MT5 login screen (e.g. ICMarkets-Live01)',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-2.5 rounded-lg border border-[#2E2E28] bg-[#1A1A14] px-3 py-2.5"
                  >
                    <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-xs text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-outfit text-xs text-[#EDE9E0]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-outfit text-[10px] text-[#7A7870]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-[#2E2E28] bg-[#1A1A14] px-3.5 py-2.5 font-outfit text-[11px] leading-relaxed text-[#7A7870]">
                <strong className="mb-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-primary">
                  Don&apos;t have an account yet?
                </strong>
                Sign up with our recommended broker — {RECOMMENDED_BROKER} —
                then return here with your credentials.
                <a
                  href="#"
                  className="mt-1.5 block text-[11px] text-primary no-underline hover:underline"
                >
                  Open {RECOMMENDED_BROKER} account ↗
                </a>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <ProgressDots active={2} />
              <div className="mb-4">
                <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A7870]">
                  * Account name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={`e.g. My ${RECOMMENDED_BROKER} Account`}
                  className="font-outfit w-full rounded-lg border border-[#2E2E28] bg-[#1A1A14] px-3.5 py-2.5 text-[13px] text-[#EDE9E0] outline-none transition-[border-color,box-shadow] placeholder:text-[#48463E] focus:border-primary/25 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.07)]"
                />
                <Hint>A friendly label — only visible to you on this platform</Hint>
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A7870]">
                  * MT5 Login ID
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. 123456789"
                  className="font-outfit w-full rounded-lg border border-[#2E2E28] bg-[#1A1A14] px-3.5 py-2.5 text-[13px] text-[#EDE9E0] outline-none transition-[border-color,box-shadow] placeholder:text-[#48463E] focus:border-primary/25 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.07)]"
                />
                <Hint>Your numeric account number from your broker</Hint>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <ProgressDots active={3} />
              <div className="mb-4">
                <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A7870]">
                  * Read-only (investor) password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your investor password"
                  className="font-outfit w-full rounded-lg border border-[#2E2E28] bg-[#1A1A14] px-3.5 py-2.5 text-[13px] text-[#EDE9E0] outline-none transition-[border-color,box-shadow] placeholder:text-[#48463E] focus:border-primary/25 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.07)]"
                />
                <Hint>Found in MT5 under Tools → Options → Investor tab</Hint>
              </div>
              <div className="mb-4">
                <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A7870]">
                  * MT5 server name
                </label>
                <input
                  type="text"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  placeholder="e.g. VantageIntl-Live"
                  className="font-outfit w-full rounded-lg border border-[#2E2E28] bg-[#1A1A14] px-3.5 py-2.5 text-[13px] text-[#EDE9E0] outline-none transition-[border-color,box-shadow] placeholder:text-[#48463E] focus:border-primary/25 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.07)]"
                />
                <Hint>Visible on the MT5 login screen under &quot;Server&quot;</Hint>
              </div>
              <div className="rounded-lg border border-[rgba(76,175,114,0.15)] bg-[rgba(76,175,114,0.06)] px-3 py-2.5 font-outfit text-[10px] leading-relaxed text-[rgba(76,175,114,0.8)]">
                <strong className="text-[#4CAF72]">Read-only access only.</strong>{' '}
                This password lets us monitor your account. We cannot place,
                modify, or close any trades on your behalf. Your trading password
                is never requested.
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <ProgressDots active={4} />
              <div className="mb-3.5 rounded-[10px] border border-[#2E2E28] bg-[#1A1A14] px-4 py-3.5">
                {[
                  ['Strategy', strategy.displayName],
                  ['Broker', RECOMMENDED_BROKER],
                  ['Account name', accountName],
                  ['MT5 Login ID', loginId],
                  ['Read-only password', '••••••••••'],
                  ['Server', server],
                ].map(([key, val], i, arr) => (
                  <div
                    key={key}
                    className={[
                      'flex items-center justify-between py-1.5 font-outfit text-xs',
                      i < arr.length - 1 ? 'border-b border-[#252520]' : '',
                    ].join(' ')}
                  >
                    <span className="text-[#7A7870]">{key}</span>
                    <span className="font-medium text-[#EDE9E0]">{val}</span>
                  </div>
                ))}
              </div>
              <p className="rounded-md bg-[#1A1A14] px-2.5 py-2 font-outfit text-[10px] leading-relaxed text-[#48463E]">
                By confirming, you grant Oroviax read-only monitoring access to
                this MT5 account and agree to our{' '}
                <a href="#" className="text-primary no-underline hover:underline">
                  Terms of Service
                </a>
                . Credentials are encrypted at rest and never shared.
              </p>
            </>
          )}

          {step === 5 && (
            <div className="py-2 text-center">
              <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[rgba(232,160,48,0.25)] bg-[rgba(232,160,48,0.08)]">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[rgba(232,160,48,0.2)] border-t-[#E8A030]" />
              </div>
              <h3 className="font-display mb-2 text-xl text-[#EDE9E0]">
                Setting up your strategy
              </h3>
              <p className="font-outfit mb-4 text-xs leading-relaxed text-[#7A7870]">
                Our team is reviewing your MT5 credentials and configuring your
                broker connection. This typically takes a few hours.
              </p>
              <div className="flex items-center gap-2.5 rounded-lg border border-primary/25 bg-primary/10 px-3.5 py-2.5 text-left">
                <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-black">
                  ✓
                </div>
                <p className="font-outfit text-[11px] leading-snug text-[#7A7870]">
                  <strong className="text-primary">
                    Credentials received &amp; verified
                  </strong>
                  <br />
                  Your submission has been securely received. You will be
                  notified by email once your strategy is live and active.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-2.5 border-t border-[#252520] bg-[#131310] px-6 pb-5 pt-3.5">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="font-outfit flex-1 cursor-pointer rounded-lg border border-[#2E2E28] bg-transparent px-3 py-2.5 text-xs text-[#7A7870] transition-colors hover:border-primary/25 hover:text-[#EDE9E0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="font-outfit flex-[2] cursor-pointer rounded-lg border-none bg-primary px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90"
              >
                I have these ready →
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-outfit flex-1 cursor-pointer rounded-lg border border-[#2E2E28] bg-transparent px-3 py-2.5 text-xs text-[#7A7870] transition-colors hover:border-primary/25 hover:text-[#EDE9E0]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (accountName.trim() && loginId.trim()) setStep(3);
                }}
                className="font-outfit flex-[2] cursor-pointer rounded-lg border-none bg-primary px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90"
              >
                Continue →
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="font-outfit flex-1 cursor-pointer rounded-lg border border-[#2E2E28] bg-transparent px-3 py-2.5 text-xs text-[#7A7870] transition-colors hover:border-primary/25 hover:text-[#EDE9E0]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goStep3}
                className="font-outfit flex-[2] cursor-pointer rounded-lg border-none bg-primary px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90"
              >
                Continue →
              </button>
            </>
          )}
          {step === 4 && (
            <>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="font-outfit flex-1 cursor-pointer rounded-lg border border-[#2E2E28] bg-transparent px-3 py-2.5 text-xs text-[#7A7870] transition-colors hover:border-primary/25 hover:text-[#EDE9E0]"
              >
                ← Edit
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="font-outfit flex-[2] cursor-pointer rounded-lg border-none bg-primary px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90"
              >
                Confirm &amp; submit
              </button>
            </>
          )}
          {step === 5 && (
            <button
              type="button"
              onClick={onClose}
              className="font-outfit w-full cursor-pointer rounded-lg border-none bg-primary px-3 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90"
            >
              Done — go to My Strategies
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
