import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import { buttonVariants } from "@/components/ui/button";
import {
  getBooking,
  getPayment,
} from "@/lib/api/ownerAction";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Payment status | EquipRent",
  description: "Confirmation of your rental payment.",
};

export const instant = false;

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) => {
  const { booking: id } = await searchParams;
  const [booking, payment] = id
    ? await Promise.all([getBooking(id), getPayment(id)])
    : [null, null];
  const paid = payment?.status === "paid" || booking?.paymentStatus === "paid";

  return (
    <AuthGuard>
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <span
          className={`mx-auto mb-5 grid size-14 place-items-center rounded-full ${
            paid ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-600"
          }`}
        >
          {paid ? <CheckCircle2 className="size-7" /> : <Clock3 className="size-7" />}
        </span>

        <h1 className="font-heading text-3xl font-bold">
          {paid ? "Payment confirmed" : "Waiting for confirmation"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {paid
            ? "Your rental is confirmed. The owner has been notified."
            : "Stripe will confirm the payment shortly. This page updates on reload."}
        </p>

        {booking ? (
          <div className="mt-8 space-y-2 rounded-xl border border-border bg-card p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Equipment</span>
              <span className="font-medium">{booking.equipmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking reference</span>
              <span className="font-medium">{booking.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-brand">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/my-rentals" className={buttonVariants({ variant: "brand" })}>
            View my rentals
          </Link>
          <Link href="/equipments" className={buttonVariants({ variant: "outline" })}>
            Browse equipment
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
};

export default PaymentSuccessPage;
