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
          Secret intergalactic radio infrastructure is under active construction. Access tier is currently controlled.
        </p>

        <div className="callout danger">
          STATUS: <strong>RESTRICTED PREVIEW</strong> — public frequency still locked.
        </div>

        <div className="pixel-banner" aria-hidden>
          {Array.from({ length: 48 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.02}s` }} />
          ))}
        </div>

        <div className="grid">
          <div className="card">
            <h3>What this is</h3>
            <p>A covert launch portal for an AI radio product that turns daily life into music.</p>
          </div>
          <div className="card">
            <h3>Current phase</h3>
            <p>Foundation and monetization rails are being finalized for immediate rollout.</p>
          </div>
          <div className="card">
            <h3>What’s next</h3>
            <p>Authentication, payments, premium channels, autonomous generation, host personas.</p>
          </div>
          <div className="card">
            <h3>Signal type</h3>
            <p>Retro-futurist simulation with modern deployment architecture.</p>
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
            <span className="tiny">(customization sample)</span>
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
            Theme selected: <b>{THEMES[theme].label}</b> — this will evolve into full user lifestyle personalization.
          </p>
        </div>

        <div className="cta-row">
          <Link className="btn primary" href="/access">Request Access</Link>
          <Link className="btn" href="/mission">Read Mission Brief</Link>
          <Link className="btn" href="/build">View Build Log</Link>
        </div>
      </section>
    </main>
  );
}
