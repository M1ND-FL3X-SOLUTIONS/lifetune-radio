'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type ThemeKey = 'night' | 'sunset' | 'neon' | 'forest';

const THEMES: Record<ThemeKey, { label: string; bg: string; cyan: string; amber: string; pink: string }> = {
  night: { label: 'Night Drive', bg: '#070912', cyan: '#00e5ff', amber: '#ffb347', pink: '#ff2d7b' },
  sunset: { label: 'Sunset Glow', bg: '#16080f', cyan: '#7df9ff', amber: '#ffb86b', pink: '#ff6ba7' },
  neon: { label: 'Neon City', bg: '#05070f', cyan: '#00f0ff', amber: '#ffd166', pink: '#ff2ec4' },
  forest: { label: 'Focus Forest', bg: '#07120d', cyan: '#6ee7d8', amber: '#fbbf24', pink: '#fb7185' },
};

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeKey>('night');
  const t = useMemo(() => THEMES[theme], [theme]);

  return (
    <main
      className="sim-wrap"
      style={{
        // @ts-ignore
        '--bg': t.bg,
        '--cyan': t.cyan,
        '--amber': t.amber,
        '--pink': t.pink,
      }}
    >
      <div className="noise" />
      <div className="orbits" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <section className="panel hero-panel">
        <p className="tiny">UNAUTHORIZED SIGNAL DETECTED // LIFETUNE.APP</p>
        <h1>⚡ LifeTune Station</h1>
        <p className="subtitle">
          AI radio that never stops. Mobile-first, creator-ready, and built to monetize from day one.
        </p>

        <div className="callout danger">
          STATUS: <strong>LIVE MVP ROLLING OUT</strong> — auth, billing, and persistent libraries being finalized.
        </div>

        <div className="pixel-banner" aria-hidden>
          {Array.from({ length: 48 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.02}s` }} />
          ))}
        </div>

        <div className="grid">
          <div className="card">
            <h3>What ships now</h3>
            <p>Continuous generation, frequency presets, lyric mode, mobile playback, download-ready outputs.</p>
          </div>
          <div className="card">
            <h3>Monetization rails</h3>
            <p>Stripe checkout, optional Ko-fi support, and day-pass/pro tier strategy for fast launch revenue.</p>
          </div>
          <div className="card">
            <h3>Core stack</h3>
            <p>Next.js + Clerk + Supabase + Stripe + on-demand GPU generation + Vercel-first deployment.</p>
          </div>
          <div className="card">
            <h3>Launch focus</h3>
            <p>Fast ship, clean UX, stable queue states, genre adherence improvements, and account-based saved tracks.</p>
          </div>
        </div>

        <div className="eq" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>

        <div className="theme-box">
          <div className="theme-head">
            <strong>Lifestyle Theme Preview</strong>
            <span className="tiny">(personalization sample)</span>
          </div>
          <div className="theme-row">
            {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
              <button
                key={k}
                className={`theme-chip ${theme === k ? 'active' : ''}`}
                onClick={() => setTheme(k)}
              >
                {THEMES[k].label}
              </button>
            ))}
          </div>
          <p className="theme-note">
            Theme selected: <b>{THEMES[theme].label}</b> — this maps to future user profiles and station mood memory.
          </p>
        </div>

        <div className="stack" style={{ marginBottom: 14 }}>
          <div className="card">
            <h3>Immediate launch checklist</h3>
            <p>✅ Clerk login · ✅ Supabase persistence · ✅ Stripe sandbox · ✅ Queue clarity · ✅ Terms/Privacy pages.</p>
          </div>
        </div>

        <div className="cta-row">
          <Link className="btn primary" href="/access">Request Access</Link>
          <Link className="btn" href="/mission">Read Mission Brief</Link>
          <Link className="btn" href="/build">View Build Log</Link>
          <Link className="btn" href="/pricing">Pricing</Link>
          <Link className="btn" href="/legal">Legal</Link>
        </div>
      </section>
    </main>
  );
}
