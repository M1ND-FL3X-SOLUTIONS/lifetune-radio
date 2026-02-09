export default function HomePage() {
  return (
    <main className="sim-wrap">
      <div className="noise" />
      <section className="panel">
        <p className="tiny">LIFETUNE STATION // PRE-LAUNCH SIMULATION</p>
        <h1>⚡ LifeTune Station</h1>
        <p className="subtitle">Intergalactic Radio Energy · Retro 90s Soul · Modern AI Future</p>

        <div className="grid">
          <div className="card">
            <h3>Mission</h3>
            <p>Turn life into music. Personalized stations, daily vibes, cinematic frequencies.</p>
          </div>
          <div className="card">
            <h3>Launch Mode</h3>
            <p>Bare-bones landing online now. Payment + login wiring next. Shipping tonight.</p>
          </div>
          <div className="card">
            <h3>Sound Aesthetic</h3>
            <p>Church calm, meditation focus, tribal pulse, and cyber-night radio textures.</p>
          </div>
          <div className="card">
            <h3>Status</h3>
            <p>Simulation online. Brand locked. Ready for Stripe onboarding + growth push.</p>
          </div>
        </div>

        <div className="eq" aria-hidden>
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.06}s` }} />
          ))}
        </div>

        <div className="cta-row">
          <a className="btn primary" href="#">Join Early Access</a>
          <a className="btn" href="#">See Vision</a>
        </div>

        <p className="foot">Built by Mind Expansion Network · LifeTune Station</p>
      </section>
    </main>
  );
}
