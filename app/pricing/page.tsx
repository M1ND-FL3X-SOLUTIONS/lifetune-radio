import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="page-wrap">
      <section className="panel">
        <p className="tiny">PRICING // LAUNCH TIERS</p>
        <h1>Choose your signal level</h1>
        <p className="subtitle">Simple launch pricing designed for fast adoption and sustainable compute.</p>

        <div className="grid">
          <div className="card">
            <h3>Free</h3>
            <p>Try the radio experience with capped daily generations and standard queue speed.</p>
          </div>
          <div className="card">
            <h3>Day Pass</h3>
            <p>24-hour unlimited generation for focused sessions, streams, and event experiments.</p>
          </div>
          <div className="card">
            <h3>Pro Monthly</h3>
            <p>Higher limits, priority generation, account library history, and premium station controls.</p>
          </div>
          <div className="card">
            <h3>Studio</h3>
            <p>Long-form packs, custom station identities, and advanced creator workflows (rolling out).</p>
          </div>
        </div>

        <div className="callout" style={{ marginTop: 14 }}>
          <p><strong>Launch note:</strong> Stripe runs in secure sandbox/production modes depending on rollout phase. Support tiers may also be offered via Ko-fi.</p>
        </div>

        <div className="cta-row">
          <Link className="btn primary" href="/checkout">Start Day Pass</Link>
          <Link className="btn" href="/access">Request Early Access</Link>
        </div>
      </section>
    </main>
  );
}
