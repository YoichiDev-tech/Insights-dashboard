import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/overview';

  if (!loading && session) return <Navigate to={from} replace />;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const message = await signIn(email.trim(), password);
    if (message) setError(message);
    setSubmitting(false);
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="w-full max-w-sm space-y-4 rounded-xl border border-white bg-white p-6 shadow-[0_12px_32px_rgba(77,106,170,0.15)] dark:border-[#2b3a55] dark:bg-[#17243a] dark:shadow-[0_12px_32px_rgba(0,0,0,0.26)]"
      >
        <div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
            PrismWave <span className="text-pw_accent">Ops Hub</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Private area. Sign in with your operator account.</p>
        </div>

        <label className="block text-sm text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-sky-200 bg-white px-3 text-base text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="block text-sm text-slate-700 dark:text-slate-200">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-sky-200 bg-white px-3 text-base text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 w-full rounded-md bg-sky-500 px-4 text-sm font-semibold text-white transition hover:bg-sky-600 dark:bg-amber dark:text-ink dark:hover:bg-amber/90 disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
