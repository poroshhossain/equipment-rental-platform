"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import RecordDetails from "@/components/dashboard/RecordDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminRentals, updateRentalStatus } from "@/lib/api/ownerAction";
import {
  formatCurrency,
  formatDate,
  formatDateRange,
  getDurationInDays,
  getInitials,
} from "@/lib/format";
import {
  bookingStatusMeta,
  paymentStatusMeta,
  rentalTypeLabels,
  type AdminRental,
  type BookingStatus,
  type PaymentStatus,
} from "@/lib/types";

const paymentStatuses = Object.keys(paymentStatusMeta) as PaymentStatus[];
const bookingStatuses = Object.keys(bookingStatusMeta) as BookingStatus[];

export default function AdminRentalsTable() {
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminRentals()
      .then(setRentals)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (
    rental: AdminRental,
    field: "paymentStatus" | "bookingStatus",
    value: string,
  ) => {
    try {
      const updated = await updateRentalStatus(rental.id, { [field]: value });
      setRentals((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success("Rental status updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update rental.",
      );
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading rentals…</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/40 hover:bg-secondary/40">
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Customer</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Owner</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Equipment</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Rental duration</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Rental type</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Qty</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Booking date</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Booking amount</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Payment</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Booking status</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental.id} className="hover:bg-secondary/30">
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                    {getInitials(rental.customer.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="max-w-36 truncate text-sm font-medium">
                      {rental.customer.name}
                    </p>
                    <p className="max-w-40 truncate text-xs text-muted-foreground">
                      {rental.customer.email || rental.customer.phone}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="min-w-0">
                  <p className="max-w-36 truncate text-sm font-medium">
                    {rental.ownerName}
                  </p>
                  <p className="max-w-40 truncate text-xs text-muted-foreground">
                    {rental.ownerEmail || "Owner"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-sm font-medium">
                {rental.equipmentName}
              </TableCell>
              <TableCell className="px-4 py-3">
                <p className="text-sm">
                  {formatDateRange(rental.startDate, rental.endDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getDurationInDays(rental.startDate, rental.endDate)} day(s)
                </p>
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                {rentalTypeLabels[rental.rentalType]}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm">{rental.quantity}</TableCell>
              <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                {rental.createdAt ? formatDate(rental.createdAt) : "—"}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm font-semibold">
                {formatCurrency(rental.bookingAmount)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <select
                  aria-label={`Payment status for ${rental.customer.name}`}
                  value={rental.paymentStatus}
                  onChange={(event) =>
                    handleStatus(
                      rental,
                      "paymentStatus",
                      event.target.value as PaymentStatus,
                    )
                  }
                  className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {paymentStatusMeta[status].label}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell className="px-4 py-3">
                <select
                  aria-label={`Booking status for ${rental.customer.name}`}
                  value={rental.bookingStatus}
                  onChange={(event) =>
                    handleStatus(
                      rental,
                      "bookingStatus",
                      event.target.value as BookingStatus,
                    )
                  }
                  className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
                >
                  {bookingStatuses.map((status) => (
                    <option key={status} value={status}>
                      {bookingStatusMeta[status].label}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell className="px-4 py-3">
                <RecordDetails record={rental} title={rental.equipmentName} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
