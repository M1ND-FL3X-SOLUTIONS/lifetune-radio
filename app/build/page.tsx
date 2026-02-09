export default function BuildPage() {
  const items = [
    'Landing portal deployed and branded for launch communications.',
    'Retro simulation theme established (CRT + neon + terminal narrative).',
    'Checkout and auth rails prepared for integration sequence.',
    'CPU app + generation path architecture defined for autonomous ops.',
    'Next phase: gated access, premium tiers, and continuous station output.',
  ];

  return (
    <main className="page-wrap">
      <section className="panel">
        <p className="tiny">BUILD LOG // CLASSIFIED</p>
        <h1>Construction Timeline</h1>
        <p className="subtitle">Current workstream is focused on launch-readiness and premium infrastructure.</p>

        <ol className="timeline">
          {items.map((item, i) => (
            <li key={i}><span>0{i + 1}</span><p>{item}</p></li>
          ))}
        </ol>
      </section>
    </main>
  );
}
