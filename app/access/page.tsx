import Link from 'next/link';

export default function AccessPage() {
  return (
    <main className="page-wrap">
      <section className="panel">
        <p className="tiny">ACCESS CONTROL // LIMITED RELEASE</p>
        <h1>Restricted Frequency Gate</h1>
        <p className="subtitle">Public transmission is open in phased mode while we finalize account persistence and premium channel controls.</p>

        <div className="callout">
          <p><strong>Early access includes:</strong> private station experiments, launch pricing, and first access to creator packs.</p>
        </div>

        <div className="stack">
          <div className="card"><h3>What unlocks first</h3><p>Saved stations, generated track history, and faster generation priority.</p></div>
          <div className="card"><h3>Launch monetization</h3><p>Day pass + Pro monthly + optional Ko-fi support for community-backed growth.</p></div>
          <div className="card"><h3>Safety policy</h3><p>LifeTune is intended for lawful, non-harassing, creator-positive use. Abuse-focused use cases are blocked.</p></div>
        </div>

        <div className="cta-row" style={{ marginTop: 14 }}>
          <Link className="btn primary" href="/checkout">Get Day Pass</Link>
          <Link className="btn" href="/pricing">View Pricing</Link>
        </div>
      </section>
    </main>
  );
}
