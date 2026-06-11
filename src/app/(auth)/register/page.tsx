'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { authApi } from '@/lib/api/authApi';
import { parseApiError } from '@/lib/api/parseApiError';
import { AuthShell } from '../components/AuthShell';
import { AuthFormShell } from '../components/AuthFormShell';
import { AuthField } from '../components/AuthField';
import { AuthCheckbox } from '../components/AuthCheckbox';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { AuthGhostButton } from '../components/AuthGhostButton';
import { AuthDivider } from '../components/AuthDivider';
import { GoogleButton } from '../components/GoogleButton';
import { PasswordStrength } from '../components/PasswordStrength';
import { OtpInput, getOtpCode } from '../components/OtpInput';
import { RegisterProgress } from '../components/RegisterProgress';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 1 | 2 | 3;

const STEP_COPY: Record<
  Step,
  { eyebrow: string; title: string; subtitle: React.ReactNode }
> = {
  1: {
    eyebrow: 'New account',
    title: 'Create your account',
    subtitle: (
      <>
        Already registered? <Link href="/sign-in">Sign in here</Link>
      </>
    ),
  },
  2: {
    eyebrow: 'Verify email',
    title: 'Check your inbox',
    subtitle: 'Enter the 6-digit code we sent you.',
  },
  3: {
    eyebrow: 'All done',
    title: 'Welcome aboard',
    subtitle: null,
  },
};

function passwordValid(pw: string): boolean {
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw);
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const copy = STEP_COPY[step];

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'Required.';
    if (!lastName.trim()) errors.lastName = 'Required.';
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!passwordValid(password)) {
      errors.password =
        'Password must be at least 8 characters and include both letters and numbers.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (!agreeTerms) {
      errors.terms = 'Please agree to the Terms of Service to continue.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStep1Submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    setGeneralError('');
    setFieldErrors({});

    try {
      await authApi.register({
        email: email.trim(),
        password,
        display_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      });
      setStep(2);
    } catch (err) {
      const parsed = parseApiError(err);
      const mapped: Record<string, string> = { ...parsed.fieldErrors };
      if (mapped.display_name) {
        mapped.firstName = mapped.display_name;
      }
      setFieldErrors(mapped);
      setGeneralError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    const code = getOtpCode(otpValues);
    if (code.length < 6) {
      setOtpError('Incorrect code. Please try again.');
      return;
    }
    setOtpError('');
    setStep(3);
  };

  const handleResendOtp = () => {
    setOtpValues(['', '', '', '', '', '']);
    setOtpError('');
    setResendMessage('Code resent. Check your inbox.');
    setTimeout(() => setResendMessage(''), 3000);
  };

  return (
    <AuthShell variant="register">
      <AuthFormShell
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle ?? undefined}
        footer={
          <>
            &copy; 2026 Oroviax &nbsp;·&nbsp;
            <Link href="#">Terms</Link> &nbsp;·&nbsp;
            <Link href="#">Privacy</Link> &nbsp;·&nbsp;
            <Link href="#">Support</Link>
          </>
        }
      >
        <RegisterProgress step={step} visible={step !== 3} />

        {step === 1 && (
          <>
            {generalError && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 font-outfit text-sm text-destructive">
                {generalError}
              </div>
            )}

            <form onSubmit={handleStep1Submit}>
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AuthField
                  id="firstName"
                  label="First name"
                  placeholder="John"
                  value={firstName}
                  onChange={setFirstName}
                  error={fieldErrors.firstName}
                  autoComplete="given-name"
                />
                <AuthField
                  id="lastName"
                  label="Last name"
                  placeholder="Smith"
                  value={lastName}
                  onChange={setLastName}
                  error={fieldErrors.lastName}
                  autoComplete="family-name"
                />
              </div>

              <AuthField
                id="regEmail"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
                error={fieldErrors.email}
                autoComplete="email"
              />

              <div className="mb-4">
                <AuthField
                  id="regPwd"
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={setPassword}
                  error={fieldErrors.password}
                  autoComplete="new-password"
                  showPasswordToggle
                />
                <PasswordStrength value={password} />
              </div>

              <AuthField
                id="regPwdConfirm"
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={fieldErrors.confirmPassword}
                autoComplete="new-password"
                showPasswordToggle
              />

              <AuthCheckbox
                id="agreeTerms"
                checked={agreeTerms}
                onChange={setAgreeTerms}
                label={
                  <>
                    I agree to the <Link href="#">Terms of Service</Link> and{' '}
                    <Link href="#">Privacy Policy</Link>. I understand this is an
                    investment monitoring platform.
                  </>
                }
              />
              {fieldErrors.terms && (
                <p className="-mt-4 mb-4 font-outfit text-[13px] text-destructive">
                  {fieldErrors.terms}
                </p>
              )}

              <AuthSubmitButton loading={loading}>
                Create account &amp; verify email
              </AuthSubmitButton>

              <p className="mt-6 text-center font-outfit text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/sign-in" className="font-medium text-primary no-underline hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-2 text-center font-outfit text-sm leading-relaxed text-muted-foreground">
              We&apos;ve sent a 6-digit code to{' '}
              <span className="font-medium text-foreground">{email}</span>.
              <br />
              Enter it below to verify your account.
            </p>

            <OtpInput values={otpValues} onChange={setOtpValues} />

            {otpError && (
              <p className="mb-3 text-center font-outfit text-[13px] text-destructive">
                {otpError}
              </p>
            )}

            <p className="text-center font-outfit text-[13px] text-muted-foreground">
              {resendMessage || (
                <>
                  Didn&apos;t receive it?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="cursor-pointer border-none bg-transparent text-primary/80 hover:text-primary"
                  >
                    Resend code
                  </button>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="cursor-pointer border-none bg-transparent text-primary/80 hover:text-primary"
                  >
                    Change email
                  </button>
                </>
              )}
            </p>

            <div className="mt-5">
              <AuthSubmitButton type="button" onClick={handleVerifyOtp}>
                Verify &amp; activate account
              </AuthSubmitButton>
              <AuthGhostButton onClick={() => setStep(1)}>
                ← Back
              </AuthGhostButton>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="py-3 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-success-500/30 bg-success-500/10 text-[28px] text-success-500">
              ✓
            </div>
            <h3 className="font-display mb-2.5 text-[28px] text-foreground">
              Account activated
            </h3>
            <p className="font-outfit mb-7 text-[15px] leading-relaxed text-muted-foreground">
              Welcome to Oroviax,{' '}
              <strong className="text-foreground">{firstName}</strong>.
              <br />
              Your account is verified and ready. Start by browsing our
              live-verified strategies.
            </p>
            <AuthSubmitButton
              type="button"
              onClick={() => router.push('/sign-in')}
            >
              Go to my dashboard →
            </AuthSubmitButton>
            <p className="mt-2 font-outfit text-sm text-muted-foreground">
              You can now sign in with your email and password.
            </p>
          </div>
        )}
      </AuthFormShell>
    </AuthShell>
  );
}
