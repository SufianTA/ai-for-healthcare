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
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="bg-grid">
            <header className="shell">
              <nav className="nav">
                <Link className="brand" href="/">
                  SurgiTrack
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
