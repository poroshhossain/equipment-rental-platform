import type { Document } from "mongodb";
import type Stripe from "stripe";

import { getDb, idFilter } from "./db";
import { stripe } from "./stripe";

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  customerEmail: string;
  createdAt: string;
}

const text = (value: unknown): string =>
  typeof value === "string" ? value : "";

const paymentData = (doc: Document): PaymentRecord => ({
  id: String(doc._id),
  bookingId: text(doc.bookingId),
  amount: Number(doc.amount ?? 0),
  currency: text(doc.currency) || "usd",
  status: text(doc.status),
  stripeSessionId: text(doc.stripeSessionId),
  stripePaymentIntentId: text(doc.stripePaymentIntentId),
  customerEmail: text(doc.customerEmail),
  createdAt: text(doc.createdAt),
});

export async function getBookingById(id: string): Promise<Document | null> {
  const db = await getDb();
  return db.collection("bookings").findOne(idFilter(id));
}

export async function getPaymentByBookingId(
  bookingId: string,
): Promise<PaymentRecord | null> {
  const db = await getDb();
  const payment = await db.collection("payments").findOne({ bookingId });
  return payment ? paymentData(payment) : null;
}

/** Opens a payment record so a checkout attempt is always traceable. */
export async function recordPendingPayment(
  bookingId: string,
  amount: number,
  stripeSessionId: string,
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.collection("payments").updateOne(
    { bookingId },
    {
      $set: {
        bookingId,
        stripeSessionId,
        amount: Number(amount),
        currency: "usd",
        status: "pending",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
}

/**
 * Single idempotent settlement path used by both the Stripe webhook and the
 * success-page verification, so payment status never depends on one callback.
 */
export async function finalizePaidSession(
  session: Stripe.Checkout.Session,
): Promise<PaymentRecord | null> {
  const bookingId =
    text(session.metadata?.bookingId) || text(session.client_reference_id);
  if (!bookingId) return null;

  const db = await getDb();
  const booking = await db.collection("bookings").findOne(idFilter(bookingId));
  if (!booking) return null;

  const now = new Date().toISOString();
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? "");

  await db.collection("bookings").updateOne(idFilter(bookingId), {
    $set: { paymentStatus: "paid", bookingStatus: "confirmed", paidAt: now },
  });

  await db.collection("rentals").updateOne(
    { bookingId },
    {
      $set: { paymentStatus: "paid", bookingStatus: "confirmed", paidAt: now },
      $setOnInsert: {
        bookingId,
        customer: booking.customer ?? {},
        equipmentId: booking.equipmentId,
        equipmentName: booking.equipmentName,
        equipmentImage: booking.equipmentImage,
        startDate: booking.startDate,
        endDate: booking.endDate,
        rentalType: booking.rentalType,
        quantity: booking.quantity,
        bookingAmount: booking.totalAmount,
        createdAt: booking.createdAt ?? now,
      },
    },
    { upsert: true },
  );

  await db.collection("payments").updateOne(
    { stripeSessionId: session.id },
    {
      $set: {
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntent,
        bookingId,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "usd",
        paymentStatus: session.payment_status,
        status: "paid",
        customerEmail: session.customer_details?.email ?? "",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: session.created
          ? new Date(session.created * 1000).toISOString()
          : now,
      },
    },
    { upsert: true },
  );

  const payment = await db
    .collection("payments")
    .findOne({ stripeSessionId: session.id });
  return payment ? paymentData(payment) : null;
}

/** Confirms the session returned by Stripe directly from the success page. */
export async function verifyCheckoutSession(sessionId: string): Promise<{
  paid: boolean;
  status?: string;
  payment?: PaymentRecord | null;
}> {
  if (!stripe) throw new Error("Stripe is not configured");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" || session.status !== "complete") {
    return { paid: false, status: session.payment_status };
  }

  const payment = await finalizePaidSession(session);
  return { paid: true, payment };
}

export async function markSessionExpired(sessionId: string): Promise<void> {
  const db = await getDb();
  await db.collection("payments").updateOne(
    { stripeSessionId: sessionId },
    { $set: { status: "expired", updatedAt: new Date().toISOString() } },
  );
}
