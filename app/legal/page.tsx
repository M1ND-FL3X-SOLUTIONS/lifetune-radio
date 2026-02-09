export default function LegalPage() {
  return (
    <main className="page-wrap">
      <section className="panel">
        <p className="tiny">LEGAL // REQUIRED DISCLOSURES</p>
        <h1>Terms, Privacy, and AI disclosure</h1>
        <p className="subtitle">This page is a launch placeholder and will be expanded into full legal documents before broad public release.</p>

        <div className="stack">
          <div className="card">
            <h3>AI-generated content</h3>
            <p>Audio generated in LifeTune may be machine-created from user prompts and system presets. Users are responsible for lawful use of outputs.</p>
          </div>
          <div className="card">
            <h3>Usage policy</h3>
            <p>No harassment, threats, stalking, or harmful targeting workflows. Accounts may be suspended for abusive use.</p>
          </div>
          <div className="card">
            <h3>Payments</h3>
            <p>Payments are processed by third-party providers (Stripe / Ko-fi). We do not store raw payment card data on LifeTune servers.</p>
          </div>
          <div className="card">
            <h3>Data handling</h3>
            <p>Account and generation metadata may be stored for service operation, usage tracking, and product improvement.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
