"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Eye, MoreHorizontal } from "lucide-react";

import RecordDetails from "@/components/dashboard/RecordDetails";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserBookings } from "@/lib/api/ownerAction";
import { authClient } from "@/lib/auth-client";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  bookingStatusMeta,
  paymentStatusMeta,
  type Booking,
} from "@/lib/types";

const headings = [
  "Equipment name",
  "Rental start",
  "Rental end",
  "Booking date",
  "Total amount",
  "Payment",
  "Booking status",
  "Actions",
];

export default function MyRentalsView() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id ?? "";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    getUserBookings(userId)
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [userId]);

  if (isPending || loading) {
    return <p className="text-sm text-muted-foreground">Loading rentals…</p>;
  }

  if (!userId) return null;

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <CalendarClock className="mx-auto mb-3 size-8 text-muted-foreground" />
        <h2 className="font-semibold">No rentals yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Book equipment and your rentals will appear here.
        </p>
        <Link href="/equipments" className={`${buttonVariants({ variant: "brand" })} mt-5`}>
          Browse equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/40 hover:bg-secondary/40">
            {headings.map((heading) => (
              <TableHead key={heading} className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const payment = paymentStatusMeta[booking.paymentStatus];
            const status = bookingStatusMeta[booking.bookingStatus];

            return (
              <TableRow key={booking.id} className="hover:bg-secondary/30">
                <TableCell className="px-4 py-3">
                  <Link
                    href={`/equipments/${booking.equipmentId}`}
                    className="font-medium hover:text-brand hover:underline"
                  >
                    {booking.equipmentName}
                  </Link>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(booking.startDate)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(booking.endDate)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(booking.createdAt)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm font-semibold">
                  {formatCurrency(booking.totalAmount)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusBadge label={payment.label} tone={payment.tone} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusBadge label={status.label} tone={status.tone} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for ${booking.equipmentName}`}
                    >
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLinkItem
                        href={`/equipments/${booking.equipmentId}`}
                      >
                        <Eye />
                        View details
                      </DropdownMenuLinkItem>
                      <RecordDetails
                        record={booking}
                        title={booking.equipmentName}
                        asMenu
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
