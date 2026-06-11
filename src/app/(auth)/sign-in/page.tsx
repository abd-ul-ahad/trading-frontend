'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, Suspense } from 'react';
import { authApi } from '@/lib/api/authApi';
import { parseApiError } from '@/lib/api/parseApiError';
import { setSession } from '@/lib/auth/session';
import { AuthShell } from '../components/AuthShell';
import { AuthFormShell } from '../components/AuthFormShell';
import { AuthField } from '../components/AuthField';
import { AuthCheckbox } from '../components/AuthCheckbox';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { AuthDivider } from '../components/AuthDivider';
import { GoogleButton } from '../components/GoogleButton';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/me/portfolio';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });
      setSession({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      });
      router.push(next);
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors({
        general: parsed.message,
        email: parsed.fieldErrors.email,
        password: parsed.fieldErrors.password,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell variant="sign-in">
      <AuthFormShell
        eyebrow="Client Portal"
        title="Sign in"
        subtitle={
          <>
            No account yet?{' '}
            <Link href="/register">Create one — it&apos;s free</Link>
          </>
        }
        footer={
          <>
            &copy; 2026 Oroviax &nbsp;·&nbsp;
            <Link href="#">Terms</Link> &nbsp;·&nbsp;
            <Link href="#">Privacy</Link> &nbsp;·&nbsp;
            <Link href="#">Support</Link>
          </>
        }
      >
        <div className="mb-7 flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2.5 font-outfit text-[13px] text-muted-foreground">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-success-500" />
          <span>
            <strong className="text-primary">MT5 Verified</strong> · Live
            performance data. No simulations.
          </span>
        </div>

        {errors.general && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 font-outfit text-sm text-destructive">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            autoComplete="email"
          />

          <AuthField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete="current-password"
            showPasswordToggle
            labelExtra={
              <Link
                href="#"
                className="font-outfit text-[13px] text-primary/80 no-underline hover:text-primary"
              >
                Forgot password?
              </Link>
            }
          />

          <AuthCheckbox
            id="remember"
            checked={remember}
            onChange={setRemember}
            label="Remember me for 30 days"
          />

          <AuthSubmitButton loading={loading}>
            {loading ? 'Signing in…' : 'Sign in to portal'}
          </AuthSubmitButton>
          
          <p className="mt-7 text-center font-outfit text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary no-underline hover:underline">
              Register now
            </Link>
          </p>
        </form>
      </AuthFormShell>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
