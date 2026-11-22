import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CreditCard, XCircle } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import { buttonVariants } from "@/components/ui/button";
import { getBooking, getPayment } from "@/lib/api/ownerAction";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payment cancelled | EquipRent",
  description: "Your rental payment was not completed.",
};

export const instant = false;

const CancelPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) => {
  const { booking: id } = await searchParams;
  const booking = id ? await getBooking(id) : null;
  const payment = id ? await getPayment(id) : null;
  const paid = payment?.status === "paid" || booking?.paymentStatus === "paid";

  return (
    <AuthGuard>
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <span
          className={cn(
            "mx-auto mb-5 grid size-14 place-items-center rounded-full",
            paid ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-600",
          )}
        >
          {paid ? <CheckCircle2 className="size-7" /> : <XCircle className="size-7" />}
        </span>

        <h1 className="font-heading text-3xl font-bold">
          {paid ? "Payment already completed" : "Payment cancelled"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {paid
            ? "Your payment went through — nothing more is needed."
            : "No charge was made. Your booking is saved as pending, so you can try again whenever you're ready."}
        </p>

        {booking ? (
          <div className="mt-8 space-y-2 rounded-xl border border-border bg-card p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Equipment</span>
              <span className="truncate font-medium">{booking.equipmentName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Booking reference</span>
              <span className="font-medium">{booking.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Amount to pay</span>
              <span className="font-semibold text-brand">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment status</span>
              <span className="font-medium capitalize">
                {booking.paymentStatus}
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {paid ? (
            <Link
              href={`/payment/success?booking=${id}`}
              className={buttonVariants({ variant: "brand" })}
            >
              <CheckCircle2 />
              View confirmation
            </Link>
          ) : booking ? (
            <Link
              href={`/payment?booking=${id}`}
              className={buttonVariants({ variant: "brand" })}
            >
              <CreditCard />
              Try payment again
            </Link>
          ) : (
            <Link href="/equipments" className={buttonVariants({ variant: "brand" })}>
              Browse equipment
            </Link>
          )}
          <Link
            href="/dashboard/my-rentals"
            className={buttonVariants({ variant: "outline" })}
          >
            View my rentals
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CancelPage;
