"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CircleDollarSign, Search, Wallet } from "lucide-react";

import EmptyState from "@/components/dashboard/EmptyState";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrency,
  formatDateRange,
  getDurationInDays,
  getInitials,
} from "@/lib/format";
import {
  bookingStatusMeta,
  paymentStatusMeta,
  rentalTypeLabels,
  type BookingStatus,
  type EquipmentRental,
  type PaymentStatus,
} from "@/lib/types";

const ALL = "all";

const bookingFilterItems = [
  { value: ALL, label: "All bookings" },
  ...(
    Object.entries(bookingStatusMeta) as [
      BookingStatus,
      { label: string },
    ][]
  ).map(([value, meta]) => ({ value, label: meta.label })),
];

const paymentFilterItems = [
  { value: ALL, label: "All payments" },
  ...(
    Object.entries(paymentStatusMeta) as [
      PaymentStatus,
      { label: string },
    ][]
  ).map(([value, meta]) => ({ value, label: meta.label })),
];

interface RentalsTableProps {
  rentals: EquipmentRental[];
}

export default function RentalsTable({ rentals }: RentalsTableProps) {
  const [search, setSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | typeof ALL>(
    ALL,
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | typeof ALL>(
    ALL,
  );

  const filteredRentals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rentals.filter((rental) => {
      const matchesQuery =
        !query ||
        rental.customer.name.toLowerCase().includes(query) ||
        rental.customer.email.toLowerCase().includes(query) ||
        rental.equipmentName.toLowerCase().includes(query) ||
        rental.id.toLowerCase().includes(query);
      const matchesBooking =
        bookingStatus === ALL || rental.bookingStatus === bookingStatus;
      const matchesPayment =
        paymentStatus === ALL || rental.paymentStatus === paymentStatus;

      return matchesQuery && matchesBooking && matchesPayment;
    });
  }, [rentals, search, bookingStatus, paymentStatus]);

  const activeCount = rentals.filter(
    (rental) => rental.bookingStatus === "active",
  ).length;
  const pendingCount = rentals.filter(
    (rental) => rental.bookingStatus === "pending",
  ).length;
  const paidRevenue = rentals
    .filter((rental) => rental.paymentStatus === "paid")
    .reduce((total, rental) => total + rental.bookingAmount, 0);
  const awaitingPayment = rentals
    .filter((rental) => rental.paymentStatus === "pending")
    .reduce((total, rental) => total + rental.bookingAmount, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active rentals"
          value={activeCount}
          hint="Equipment currently out"
          icon={CalendarClock}
          tone="success"
        />
        <StatCard
          label="Pending requests"
          value={pendingCount}
          hint="Waiting for confirmation"
          icon={CalendarClock}
          tone="warning"
        />
        <StatCard
          label="Paid revenue"
          value={formatCurrency(paidRevenue)}
          hint="Confirmed payments"
          icon={Wallet}
        />
        <StatCard
          label="Awaiting payment"
          value={formatCurrency(awaitingPayment)}
          hint="Payment not completed"
          icon={CircleDollarSign}
          tone="danger"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customer, equipment or booking…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search rentals"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              items={bookingFilterItems}
              value={bookingStatus}
              onValueChange={(value) =>
                setBookingStatus(
                  (value as BookingStatus | typeof ALL) ?? ALL,
                )
              }
            >
              <SelectTrigger
                className="h-9 w-full sm:w-40"
                aria-label="Filter by booking status"
              >
                <SelectValue placeholder="All bookings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All bookings</SelectItem>
                {(
                  Object.entries(bookingStatusMeta) as [
                    BookingStatus,
                    { label: string },
                  ][]
                ).map(([value, meta]) => (
                  <SelectItem key={value} value={value}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={paymentFilterItems}
              value={paymentStatus}
              onValueChange={(value) =>
                setPaymentStatus(
                  (value as PaymentStatus | typeof ALL) ?? ALL,
                )
              }
            >
              <SelectTrigger
                className="h-9 w-full sm:w-40"
                aria-label="Filter by payment status"
              >
                <SelectValue placeholder="All payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All payments</SelectItem>
                {(
                  Object.entries(paymentStatusMeta) as [
                    PaymentStatus,
                    { label: string },
                  ][]
                ).map(([value, meta]) => (
                  <SelectItem key={value} value={value}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRentals.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No rentals found"
            description="Try a different search term or clear the status filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setBookingStatus(ALL);
                  setPaymentStatus(ALL);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                    {[
                      "Customer",
                      "Equipment",
                      "Rental duration",
                      "Qty",
                      "Booking amount",
                      "Payment",
                      "Booking status",
                    ].map((heading) => (
                      <TableHead
                        key={heading}
                        className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                      >
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRentals.map((rental) => {
                    const paymentMeta = paymentStatusMeta[rental.paymentStatus];
                    const bookingMeta = bookingStatusMeta[rental.bookingStatus];
                    const days = getDurationInDays(
                      rental.startDate,
                      rental.endDate,
                    );

                    return (
                      <TableRow key={rental.id} className="hover:bg-secondary/30">
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                              {getInitials(rental.customer.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="max-w-40 truncate text-sm font-semibold">
                                {rental.customer.name}
                              </p>
                              <p className="max-w-44 truncate text-xs text-muted-foreground">
                                {rental.customer.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={rental.equipmentImage}
                              alt={rental.equipmentName}
                              className="size-9 shrink-0 rounded-lg bg-secondary object-cover"
                            />
                            <div className="min-w-0">
                              <p className="max-w-44 truncate text-sm font-medium">
                                {rental.equipmentName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {rental.equipmentCategory}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <p className="text-sm">
                            {formatDateRange(rental.startDate, rental.endDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {days} {days === 1 ? "day" : "days"} ·{" "}
                            {rentalTypeLabels[rental.rentalType]}
                          </p>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm font-medium">
                          {rental.quantity}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm font-semibold">
                          {formatCurrency(rental.bookingAmount)}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <StatusBadge
                            label={paymentMeta.label}
                            tone={paymentMeta.tone}
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <StatusBadge
                            label={bookingMeta.label}
                            tone={bookingMeta.tone}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-border/70 lg:hidden">
              {filteredRentals.map((rental) => {
                const paymentMeta = paymentStatusMeta[rental.paymentStatus];
                const bookingMeta = bookingStatusMeta[rental.bookingStatus];
                const days = getDurationInDays(
                  rental.startDate,
                  rental.endDate,
                );

                return (
                  <div key={rental.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                          {getInitials(rental.customer.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {rental.customer.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {rental.customer.email}
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        label={bookingMeta.label}
                        tone={bookingMeta.tone}
                      />
                    </div>

                    <div className="flex items-center gap-2.5 rounded-lg bg-secondary/40 p-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rental.equipmentImage}
                        alt={rental.equipmentName}
                        className="size-9 shrink-0 rounded-lg bg-secondary object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {rental.equipmentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateRange(rental.startDate, rental.endDate)} ·{" "}
                          {days}d · Qty {rental.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Payment
                        </span>
                        <StatusBadge
                          label={paymentMeta.label}
                          tone={paymentMeta.tone}
                        />
                      </div>
                      <span className="font-heading text-base font-semibold">
                        {formatCurrency(rental.bookingAmount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredRentals.length} of {rentals.length} rentals
          </span>
          <span>Booking data from the API.</span>
        </div>
      </div>
    </div>
  );
}
