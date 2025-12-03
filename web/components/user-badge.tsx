'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export function UserBadge() {
  const { user, logout, loading, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const onLogout = () => {
    logout();
    if (pathname !== '/') {
      router.push('/');
    }
  };

  if (loading) {
    return <div className="pill muted">Loading…</div>;
  }

  if (!token || !user) {
    return (
      <div className="pill-row">
        <Link className="ghost-button" href="/login">
          Login
        </Link>
        <Link className="button" href="/register">
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="pill-row">
      <div className="pill">{user.full_name || user.email}</div>
      <button className="ghost-button" onClick={onLogout} type="button">
        Log out
      </button>
    </div>
  );
}
