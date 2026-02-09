import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="sim-wrap">
      <div className="noise" />
      <section className="panel">
        <p className="tiny">UNAUTHORIZED SIGNAL DETECTED</p>
        <h1>⚡ LifeTune Station</h1>
        <p className="subtitle">Secret intergalactic radio infrastructure is under active construction.</p>

        <div className="callout danger">
          STATUS: <strong>RESTRICTED PREVIEW</strong> — public frequency still locked.
        </div>

        <div className="grid">
          <div className="card"><h3>What this is</h3><p>A covert launch portal for an AI radio product that turns daily life into music.</p></div>
          <div className="card"><h3>Current phase</h3><p>Foundation and monetization rails are being finalized for immediate rollout.</p></div>
          <div className="card"><h3>What’s next</h3><p>Authentication, payments, premium channels, autonomous generation, host personas.</p></div>
          <div className="card"><h3>Signal type</h3><p>Retro-futurist simulation with modern deployment architecture.</p></div>
        </div>

        <div className="eq" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.05}s` }} />)}
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
