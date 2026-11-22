"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  CircleDollarSign,
  MoreHorizontal,
  Search,
  Wallet,
} from "lucide-react";

import EmptyState from "@/components/dashboard/EmptyState";
import RecordDetails from "@/components/dashboard/RecordDetails";
import {
  TablePagination,
  usePagination,
} from "@/components/dashboard/TablePagination";
import StatCard from "@/components/dashboard/StatCard";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  type StatusTone,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "all";

const paymentLabels = Object.fromEntries(
  (Object.entries(paymentStatusMeta) as [PaymentStatus, { label: string }][]).map(
    ([value, meta]) => [value, meta.label],
  ),
) as Record<PaymentStatus, string>;

const bookingLabels = Object.fromEntries(
  (Object.entries(bookingStatusMeta) as [BookingStatus, { label: string }][]).map(
    ([value, meta]) => [value, meta.label],
  ),
) as Record<BookingStatus, string>;

const bookingFilters = [
  { value: ALL, label: "All bookings" },
  ...(Object.entries(bookingStatusMeta) as [BookingStatus, { label: string }][]).map(
    ([value, meta]) => ({ value, label: meta.label }),
  ),
];

const paymentFilters = [
  { value: ALL, label: "All payments" },
  ...(Object.entries(paymentStatusMeta) as [PaymentStatus, { label: string }][]).map(
    ([value, meta]) => ({ value, label: meta.label }),
  ),
];

const badgeToneClasses: Record<StatusTone, string> = {
  success:
    "bg-success/10 text-emerald-700 ring-success/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  danger:
    "bg-destructive/10 text-destructive ring-destructive/20 dark:text-red-400",
  info: "bg-brand/10 text-brand ring-brand/20",
  neutral: "bg-muted text-muted-foreground ring-border",
};

/** Compact, colour-coded status control that works in tables and cards. */
function StatusSelect<T extends string>({
  value,
  labels,
  tone,
  label,
  disabled,
  onChange,
}: {
  value: T;
  labels: Record<T, string>;
  tone: StatusTone;
  label: string;
  disabled?: boolean;
  onChange: (value: T) => void;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 max-w-full items-center rounded-full px-2.5 text-xs font-medium ring-1 ring-inset",
        badgeToneClasses[tone],
      )}
    >
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T)}
        className="max-w-full cursor-pointer appearance-none bg-transparent pr-0.5 outline-none disabled:cursor-wait disabled:opacity-60"
      >
        {(Object.keys(labels) as T[]).map((key) => (
          <option key={key} value={key} className="text-foreground">
            {labels[key]}
          </option>
        ))}
      </select>
    </span>
  );
}

function RentalDetailsMenu({ rental }: { rental: AdminRental }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${rental.equipmentName}`}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <RecordDetails
          record={rental}
          title={rental.equipmentName}
          asMenu
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AdminRentalsTable() {
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | typeof ALL>(
    ALL,
  );
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | typeof ALL>(
    ALL,
  );
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    getAdminRentals()
      .then(setRentals)
      .finally(() => setLoading(false));
  }, []);

  const filteredRentals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rentals.filter((rental) => {
      const matchesQuery =
        !query ||
        [rental.customer?.name, rental.customer?.email, rental.customer?.phone,
          rental.ownerName, rental.ownerEmail, rental.equipmentName, rental.id]
          .some((value) => String(value ?? "").toLowerCase().includes(query));
      const matchesBooking =
        bookingFilter === ALL || rental.bookingStatus === bookingFilter;
      const matchesPayment =
        paymentFilter === ALL || rental.paymentStatus === paymentFilter;

      return matchesQuery && matchesBooking && matchesPayment;
    });
  }, [rentals, search, bookingFilter, paymentFilter]);

  const stats = useMemo(() => {
    const pendingPayment = rentals.filter(
      (rental) => rental.paymentStatus === "pending",
    ).length;
    const pendingBooking = rentals.filter(
      (rental) => rental.bookingStatus === "pending",
    ).length;
    const collected = rentals
      .filter((rental) => rental.paymentStatus === "paid")
      .reduce((sum, rental) => sum + Number(rental.bookingAmount ?? 0), 0);

    return { total: rentals.length, pendingPayment, pendingBooking, collected };
  }, [rentals]);

  const handleStatus = async (
    rental: AdminRental,
    field: "paymentStatus" | "bookingStatus",
    value: PaymentStatus | BookingStatus,
  ) => {
    const previous = rental[field];
    const key = `${rental.id}:${field}`;
    setBusyKey(key);
    setRentals((current) =>
      current.map((item) =>
        item.id === rental.id ? { ...item, [field]: value } : item,
      ),
    );

    try {
      const updated = await updateRentalStatus(rental.id, { [field]: value });
      setRentals((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success("Rental status updated");
    } catch (error) {
      setRentals((current) =>
        current.map((item) =>
          item.id === rental.id ? { ...item, [field]: previous } : item,
        ),
      );
      toast.error(
        error instanceof Error ? error.message : "Could not update rental.",
      );
    } finally {
      setBusyKey(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setBookingFilter(ALL);
    setPaymentFilter(ALL);
  };

  const {
    page,
    pageCount,
    pageItems,
    start,
    end,
    total,
    setPage,
  } = usePagination(
    filteredRentals,
    8,
    `${search}|${bookingFilter}|${paymentFilter}`,
  );

  if (loading) {
    return <TableSkeleton rows={8} columns={9} label="Loading rentals" />;
  }

  const hasFilters = Boolean(search) || bookingFilter !== ALL || paymentFilter !== ALL;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total rentals"
          value={stats.total}
          hint="All bookings on the platform"
          icon={CalendarClock}
        />
        <StatCard
          label="Pending bookings"
          value={stats.pendingBooking}
          hint="Awaiting confirmation"
          icon={CalendarClock}
          tone="warning"
        />
        <StatCard
          label="Awaiting payment"
          value={stats.pendingPayment}
          hint="Payment not completed"
          icon={CircleDollarSign}
          tone="danger"
        />
        <StatCard
          label="Collected revenue"
          value={formatCurrency(stats.collected)}
          hint="From paid bookings"
          icon={Wallet}
          tone="success"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customer, owner, equipment or ID…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search rentals"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              items={bookingFilters}
              value={bookingFilter}
              onValueChange={(value) =>
                setBookingFilter((value as BookingStatus | typeof ALL) ?? ALL)
              }
            >
              <SelectTrigger
                className="h-9 w-full sm:w-40"
                aria-label="Filter by booking status"
              >
                <SelectValue placeholder="All bookings" />
              </SelectTrigger>
              <SelectContent>
                {bookingFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={paymentFilters}
              value={paymentFilter}
              onValueChange={(value) =>
                setPaymentFilter((value as PaymentStatus | typeof ALL) ?? ALL)
              }
            >
              <SelectTrigger
                className="h-9 w-full sm:w-40"
                aria-label="Filter by payment status"
              >
                <SelectValue placeholder="All payments" />
              </SelectTrigger>
              <SelectContent>
                {paymentFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRentals.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title={rentals.length === 0 ? "No rentals yet" : "No matching rentals"}
            description={
              rentals.length === 0
                ? "Bookings will appear here as soon as customers confirm a rental."
                : "Try a different search term or clear the status filters."
            }
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Wide screens: compact data table */}
            <div className="hidden xl:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                    {[
                      "Customer",
                      "Equipment",
                      "Owner",
                      "Rental",
                      "Booked on",
                      "Amount",
                      "Payment",
                      "Booking status",
                      "",
                    ].map((heading, index) => (
                      <TableHead
                        key={heading || `actions-${index}`}
                        className={cn(
                          "px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                          index === 8 && "text-right",
                        )}
                      >
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((rental) => {
                    const days = getDurationInDays(
                      rental.startDate,
                      rental.endDate,
                    );

                    return (
                      <TableRow key={rental.id} className="hover:bg-secondary/30">
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                              {getInitials(rental.customer?.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="max-w-32 truncate text-sm font-medium">
                                {rental.customer?.name}
                              </p>
                              <p className="max-w-36 truncate text-xs text-muted-foreground">
                                {rental.customer?.email || rental.customer?.phone}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <p className="max-w-40 truncate text-sm font-medium">
                            {rental.equipmentName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rentalTypeLabels[rental.rentalType]}
                          </p>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <p className="max-w-32 truncate text-sm text-muted-foreground">
                            {rental.ownerName || "—"}
                          </p>
                          <p className="max-w-36 truncate text-xs text-muted-foreground">
                            {rental.ownerEmail}
                          </p>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <p className="text-sm">
                            {formatDateRange(rental.startDate, rental.endDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {days} {days === 1 ? "day" : "days"} · Qty{" "}
                            {rental.quantity}
                          </p>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                          {rental.createdAt ? formatDate(rental.createdAt) : "—"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
                          {formatCurrency(rental.bookingAmount)}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <StatusSelect
                            value={rental.paymentStatus}
                            labels={paymentLabels}
                            tone={paymentStatusMeta[rental.paymentStatus].tone}
                            label={`Payment status for ${rental.customer?.name}`}
                            disabled={busyKey === `${rental.id}:paymentStatus`}
                            onChange={(value) =>
                              handleStatus(rental, "paymentStatus", value)
                            }
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <StatusSelect
                            value={rental.bookingStatus}
                            labels={bookingLabels}
                            tone={bookingStatusMeta[rental.bookingStatus].tone}
                            label={`Booking status for ${rental.customer?.name}`}
                            disabled={busyKey === `${rental.id}:bookingStatus`}
                            onChange={(value) =>
                              handleStatus(rental, "bookingStatus", value)
                            }
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <RentalDetailsMenu rental={rental} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Small / medium screens: stacked cards */}
            <div className="divide-y divide-border/70 xl:hidden">
              {pageItems.map((rental) => {
                const days = getDurationInDays(
                  rental.startDate,
                  rental.endDate,
                );

                return (
                  <div key={rental.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                          {getInitials(rental.customer?.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {rental.customer?.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {rental.customer?.email || rental.customer?.phone}
                          </p>
                        </div>
                      </div>
                      <RentalDetailsMenu rental={rental} />
                    </div>

                    <div className="flex items-center gap-2.5 rounded-lg bg-secondary/40 p-2.5">
                      {rental.equipmentImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rental.equipmentImage}
                          alt={rental.equipmentName}
                          className="size-9 shrink-0 rounded-lg bg-secondary object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {rental.equipmentName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatDateRange(rental.startDate, rental.endDate)} ·{" "}
                          {days} {days === 1 ? "day" : "days"} · Qty{" "}
                          {rental.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold whitespace-nowrap">
                        {formatCurrency(rental.bookingAmount)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-secondary/50 p-2.5">
                        <p className="text-muted-foreground">Owner</p>
                        <p className="truncate font-semibold">
                          {rental.ownerName || "—"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2.5">
                        <p className="text-muted-foreground">Booked on</p>
                        <p className="font-semibold">
                          {rental.createdAt ? formatDate(rental.createdAt) : "—"}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center justify-between gap-2 rounded-lg bg-secondary/50 p-2.5">
                        <span className="text-muted-foreground">Payment</span>
                        <StatusSelect
                          value={rental.paymentStatus}
                          labels={paymentLabels}
                          tone={paymentStatusMeta[rental.paymentStatus].tone}
                          label={`Payment status for ${rental.customer?.name}`}
                          disabled={busyKey === `${rental.id}:paymentStatus`}
                          onChange={(value) =>
                            handleStatus(rental, "paymentStatus", value)
                          }
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-between gap-2 rounded-lg bg-secondary/50 p-2.5">
                        <span className="text-muted-foreground">Booking status</span>
                        <StatusSelect
                          value={rental.bookingStatus}
                          labels={bookingLabels}
                          tone={bookingStatusMeta[rental.bookingStatus].tone}
                          label={`Booking status for ${rental.customer?.name}`}
                          disabled={busyKey === `${rental.id}:bookingStatus`}
                          onChange={(value) =>
                            handleStatus(rental, "bookingStatus", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <TablePagination
          page={page}
          pageCount={pageCount}
          start={start}
          end={end}
          total={total}
          onPageChange={setPage}
          label="rentals"
        />
      </div>
    </div>
  );
}
