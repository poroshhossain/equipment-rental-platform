import { NextResponse } from "next/server";

import { getBookingById, recordPendingPayment } from "@/lib/server/payments";
import { stripe } from "@/lib/server/stripe";

const text = (value: unknown): string =>
  typeof value === "string" ? value : "";

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { success: false, message: "Stripe is not configured." },
        { status: 503 },
      );
    }

    const { bookingId } = await request.json();
    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing booking id." },
        { status: 400 },
      );
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 },
      );
    }

    const origin = new URL(request.url).origin;
    const successUrl = `${origin}/payment/success?booking=${encodeURIComponent(bookingId)}`;
    if (booking.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        data: { url: successUrl, paid: true },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: bookingId,
      customer_email: text(booking.customer?.email) || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: text(booking.equipmentName) || "Equipment rental",
              description: `${text(booking.startDate)} – ${text(booking.endDate)}`,
            },
            unit_amount: Math.round(Number(booking.totalAmount) * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: { metadata: { bookingId } },
      metadata: { bookingId },
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment?booking=${encodeURIComponent(bookingId)}`,
    });

    await recordPendingPayment(bookingId, Number(booking.totalAmount), session.id);

    return NextResponse.json({
      success: true,
      data: { url: session.url, sessionId: session.id },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Could not start checkout.",
      },
      { status: 500 },
    );
  }
}
