export default function BuildPage() {
  const items = [
    'Portal upgraded to launch-ready messaging and clearer monetization path.',
    'Retro simulation theme retained with stronger product clarity and CTAs.',
    'Clerk + Supabase + Stripe stack positioned as primary launch backbone.',
    'On-demand GPU strategy documented to prevent runaway compute burn.',
    'Current sprint: queue clarity, genre adherence, and account persistence hardening.',
    'Next sprint: shareable stations, birthday packs, streamer bundles, and MIDI alpha.',
  ];

  return (
    <main className="page-wrap">
      <section className="panel">
        <p className="tiny">BUILD LOG // CLASSIFIED</p>
        <h1>Construction Timeline</h1>
        <p className="subtitle">Current workstream is focused on launch-readiness, billing, and repeatable revenue.</p>

        <ol className="timeline">
          {items.map((item, i) => (
            <li key={i}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></li>
          ))}
        </ol>
      </section>
    </main>
  );
}
