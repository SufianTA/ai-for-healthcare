import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { UserBadge } from '../components/user-badge';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SurgiTrack',
  description: 'Surgical skill training tracker',
};

const links = [
  { href: '/tasks', label: 'Tasks' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/founders', label: 'Founders' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <video
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/surgery-bg.mp4"
        >
          <source src="/surgery-bg.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" aria-hidden />
        <Providers>
          <div className="bg-grid">
            <header className="shell">
              <nav className="nav">
                <Link className="brand" href="/">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="11" stroke="#0ea5e9" strokeWidth="2" />
                      <path d="M8 11.5h8M12 7v9" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    SurgiTrack
                  </span>
                </Link>
                <div className="nav-links">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href} className="nav-link">
                      {link.label}
                    </Link>
                  ))}
                </div>
                <UserBadge />
              </nav>
            </header>
            <main className="shell main-shell">{children}</main>
            <footer className="shell footer">
              <div className="muted">Built for surgical skills labs • FastAPI + Next.js</div>
              <div className="muted">Secure scoring, attempt history, and sharable leaderboards</div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
