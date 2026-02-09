import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

const PRODUCTS: Record<string, { name: string; description: string; priceInCents: number }> = {
  day_pass: {
    name: 'LifeTune Day Pass',
    description: 'Unlimited generation for 24 hours',
    priceInCents: 500,
  },
  pro_monthly: {
    name: 'LifeTune Pro Monthly',
    description: '12 tracks/day, 3 stations, priority queue',
    priceInCents: 799,
  },
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const body = await req.json();
    const productId = (body?.productId || 'day_pass') as string;
    const product = PRODUCTS[productId] || PRODUCTS.day_pass;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create session' }, { status: 500 });
  }
}
