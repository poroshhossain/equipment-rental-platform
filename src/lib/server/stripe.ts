import Stripe from "stripe";

/** Server-only Stripe client. Checkout is disabled when the key is missing. */
const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey ? new Stripe(secretKey) : null;
