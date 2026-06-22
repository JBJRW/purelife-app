import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://purelifewellnessclub.org');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    const { userId, userEmail } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'userId and userEmail are required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1TVbUd2d05WpkcPe9HUVy3eK',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://purelifewellnessclub.org/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://purelifewellnessclub.org/plans`,
      customer_email: userEmail,
      metadata: {
        userId,
        plan: 'founding_member',
      },
      subscription_data: {
        metadata: {
          userId,
          plan: 'founding_member',
        },
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
