'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth-context';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await login(email, password);
      setMessage('Logged in. Redirecting to your dashboard…');
      setTimeout(() => router.push('/dashboard'), 350);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="badge" style={{ marginBottom: 12 }}>
        Welcome back
      </div>
      <h2 style={{ margin: '0 0 6px' }}>Login</h2>
      <p className="muted" style={{ marginTop: 0 }}>Use your SurgiTrack account to sync attempts.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
        <label>
          Email
          <input
            className="input"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="resident@example.com"
          />
        </label>
        <label>
          Password
          <input
            className="input"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button className="button" type="submit" disabled={loading}>
          Sign in
        </button>
      </form>
      {message && <p style={{ color: '#22d3ee' }}>{message}</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
    </div>
  );
}
