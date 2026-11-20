import Link from "next/link";
import { Info, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDateRange } from "@/lib/format";
import { rentalTypeLabels, type Booking } from "@/lib/types";

export default function PaymentSummary({ booking }: { booking: Booking | null }) {
  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold">Booking not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not find that booking. Browse equipment to start again.
        </p>
        <Link href="/equipments" className={`${buttonVariants({ variant: "brand" })} mt-6`}>
          Browse equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12 sm:px-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">Payment</h1>
        <p className="text-sm text-muted-foreground">
          Review your booking details before paying.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{booking.equipmentName}</CardTitle>
          <CardDescription>
            Booking reference {booking.id.slice(-8).toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Rental period", formatDateRange(booking.startDate, booking.endDate)],
              ["Rental type", rentalTypeLabels[booking.rentalType]],
              ["Quantity", String(booking.quantity)],
              ["Duration", `${booking.days} day(s)`],
              ["Contact", booking.contactNumber],
              ["Delivery address", booking.deliveryAddress],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border/70 p-3">
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-secondary/60 p-4">
            <span className="text-sm font-medium">Total amount</span>
            <span className="font-heading text-2xl font-bold text-brand">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>

          <div className="flex gap-3 rounded-lg border border-brand/20 bg-brand/5 p-4 text-sm">
            <Info className="size-4 shrink-0 text-brand" />
            <div className="space-y-1">
              <p className="font-medium">Payment integration coming soon</p>
              <p className="text-muted-foreground">
                Your booking is saved with a pending payment. A payment gateway
                will be connected here later.
              </p>
            </div>
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-brand" />
            This booking is recorded with your owner and can be reviewed in your
            dashboard.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/customer" className={buttonVariants({ variant: "outline" })}>
          Go to dashboard
        </Link>
        <Link href="/equipments" className={buttonVariants({ variant: "brand" })}>
          Browse more equipment
        </Link>
      </div>
    </div>
  );
}
