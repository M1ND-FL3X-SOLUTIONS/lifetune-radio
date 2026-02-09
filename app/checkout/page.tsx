import CheckoutEmbed from '../components/CheckoutEmbed';

export default function CheckoutPage() {
  return (
    <main className="page-wrap">
      <section className="panel">
        <p className="tiny">PAYMENT PORTAL // SECURE CHANNEL</p>
        <h1>Checkout</h1>
        <p className="subtitle">Complete your LifeTune Day Pass purchase.</p>
        <CheckoutEmbed productId="day_pass" />
      </section>
    </main>
  );
}
