import { NextResponse } from "next/server";

import { getPaymentByBookingId } from "@/lib/server/payments";

export async function GET(request: Request) {
  const bookingId = new URL(request.url).searchParams.get("bookingId");
  if (!bookingId) {
    return NextResponse.json(
      { success: false, message: "Missing booking id." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({
      success: true,
      data: await getPaymentByBookingId(bookingId),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Could not load payment.",
      },
      { status: 500 },
    );
  }
}
