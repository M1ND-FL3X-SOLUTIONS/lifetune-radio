import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LifeTune Station — Intergalactic Simulation',
  description: 'A retro-futuristic simulation for the LifeTune Station launch.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
