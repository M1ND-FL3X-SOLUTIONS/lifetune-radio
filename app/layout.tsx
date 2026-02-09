import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'LifeTune Station // Restricted Build',
  description: 'Classified pre-launch portal for LifeTune Station.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="brand">LIFETUNE // CLASSIFIED</div>
          <nav>
            <Link href="/">Portal</Link>
            <Link href="/mission">Mission</Link>
            <Link href="/build">Build Log</Link>
            <Link href="/access">Access</Link>
            <Link href="/checkout">Checkout</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
