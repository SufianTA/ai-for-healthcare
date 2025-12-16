'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth-context';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await register(email, password, fullName);
      setMessage('Account created. Redirecting...');
      setTimeout(() => router.push('/dashboard'), 350);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="badge" style={{ marginBottom: 12 }}>
        Create account
      </div>
      <h2 style={{ margin: '0 0 6px' }}>Join SurgiTrack</h2>
      <p className="muted" style={{ marginTop: 0 }}>Set a password to start logging attempts.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
        <label>
          Full name
          <input
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Taylor Resident"
          />
        </label>
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
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button className="button" type="submit" disabled={loading}>
          Create account
        </button>
      </form>
      {message && <p style={{ color: '#22d3ee' }}>{message}</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
    </div>
  );
}
