export default function MissionPage() {
  return (
    <main className="page-wrap">
      <section className="panel">
        <p className="tiny">MISSION BRIEF // INTERNAL</p>
        <h1>Why LifeTune exists</h1>
        <p className="subtitle">We’re building a personalized AI radio system designed to soundtrack real life in real time.</p>

        <div className="stack">
          <div className="card"><h3>Vision</h3><p>Give people a station that adapts to mood, routine, and intention — focus, calm, prayer, gym, late-night drive, all of it.</p></div>
          <div className="card"><h3>Launch model</h3><p>Ship lightweight now, monetize early, then expand into stations, hosts, and deeper production tooling.</p></div>
          <div className="card"><h3>Audience</h3><p>Streamers, creators, founders, small venues, and anyone wanting safe royalty-friendly AI background music.</p></div>
          <div className="card"><h3>Operating principle</h3><p>Cost-aware architecture: CPU app always on, GPU spins up only when users tune in and generate.</p></div>
        </div>
      </section>
    </main>
  );
}
