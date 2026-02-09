import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'LifeTune Station // AI Radio',
  description: 'AI radio platform with launch-ready auth, billing, and creator workflows.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="brand">LIFETUNE // LIVE BUILD</div>
          <nav>
            <Link href="/">Portal</Link>
            <Link href="/mission">Mission</Link>
            <Link href="/build">Build Log</Link>
            <Link href="/access">Access</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/legal">Legal</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
