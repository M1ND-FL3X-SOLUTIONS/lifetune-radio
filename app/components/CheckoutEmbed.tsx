'use client';

import { useCallback, useMemo } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutEmbed({ productId = 'day_pass' }: { productId?: string }) {
  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''),
    []
  );

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/stripe/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Checkout failed');
    return data.clientSecret;
  }, [productId]);

  return (
    <div style={{ border: '1px solid rgba(0,229,255,.4)', padding: 12, background: 'rgba(0,0,0,.2)' }}>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
