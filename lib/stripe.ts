import 'server-only';
import Stripe from 'stripe';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover' as Stripe.LatestApiVersion,
  });
}
