import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '../lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

function logWithTraceId(traceId: string, message: string, meta?: any) {
  console.log(`[traceId=${traceId}] ${message}`, meta || '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const traceId = req.headers['x-trace-id'] as string || Math.random().toString(36).substring(2);
  try {
    if (req.method === 'POST') {
      // Create Stripe Checkout Session
      const { priceId, userId } = req.body;
      if (!priceId || !userId) return res.status(400).json({ error: 'Missing priceId or userId' });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${DOMAIN}/billing?success=1`,
        cancel_url: `${DOMAIN}/billing?canceled=1`,
        client_reference_id: userId,
      });
      logWithTraceId(traceId, 'Created Stripe checkout session', session);
      return res.status(200).json({ url: session.url });
    }
    if (req.method === 'POST' && req.headers['stripe-signature']) {
      // Handle Stripe webhook
      const sig = req.headers['stripe-signature'] as string;
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err: any) {
        logWithTraceId(traceId, 'Webhook signature verification failed', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      // Handle subscription events
      if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId || subscription.client_reference_id;
        if (userId) {
          await supabase.from('subscriptions').upsert({
            id: subscription.id,
            user_id: userId,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });
          logWithTraceId(traceId, 'Updated subscription status in Supabase', subscription);
        }
      }
      res.status(200).json({ received: true });
      return;
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    logWithTraceId(traceId, 'Error in Stripe API route', error);
    res.status(500).json({ error: error.message, traceId });
  }
}
