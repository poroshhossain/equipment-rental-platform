import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  finalizePaidSession,
  markSessionExpired,
} from "@/lib/server/payments";
import { stripe } from "@/lib/server/stripe";

/** Stripe sends the raw, signed payload here; signature checks need that body. */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({
      received: true,
      message: "Stripe webhook is not configured.",
    });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    return NextResponse.json(
      {
        received: false,
        message: error instanceof Error ? error.message : "Invalid webhook.",
      },
      { status: 400 },
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    await finalizePaidSession(event.data.object);
  }

  if (event.type === "checkout.session.expired") {
    await markSessionExpired(event.data.object.id);
  }

  return NextResponse.json({ received: true });
}
