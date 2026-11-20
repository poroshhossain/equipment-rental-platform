import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Package,
  PackagePlus,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getOwnerAnalytics,
  getOwnerEquipment,
  getOwnerProfile,
  getOwnerRentals,
  getRevenue,
} from "@/lib/api/ownerAction";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDateRange,
  getInitials,
} from "@/lib/format";
import { serverToken } from "@/lib/server-token";
import { bookingStatusMeta, equipmentStatusMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

const OwnerDashboardPage = async () => {
  const token = await serverToken();
  const profile = await getOwnerProfile(token);
  const ownerEmail = profile?.email ?? "";
  const [equipment, rentals, monthlyRevenue, analytics] = await Promise.all([
    getOwnerEquipment(ownerEmail, token),
    getOwnerRentals(ownerEmail, token),
    getRevenue(token),
    getOwnerAnalytics(ownerEmail, token),
  ]);
  const categoryCount = new Set(equipment.map((item) => item.category)).size;
  const activeRentals = rentals.filter(
    (rental) => rental.bookingStatus === "active",
  ).length;
  const pendingReview = equipment.filter(
    (item) => item.status === "pending",
  );
  const paidRevenue = rentals
    .filter((rental) => rental.paymentStatus === "paid")
    .reduce((total, rental) => total + rental.bookingAmount, 0);
  const recentRentals = [...rentals]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((month) => month.amount));
  const totalRevenue = monthlyRevenue.reduce(
    (total, month) => total + month.amount,
    0,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Owner dashboard"
        title={`Welcome back, ${profile?.name.split(" ")[0] ?? "Owner"}`}
        description="Here is how your equipment and rentals are performing this month."
        actions={
          <>
            <Link
              href="/dashboard/my-equipment-rentals"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <ClipboardList />
              View rentals
            </Link>
            <Link
              href="/dashboard/add-equipment"
              className={buttonVariants({ variant: "brand", size: "lg" })}
            >
              <PackagePlus />
              Add equipment
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total equipment"
          value={equipment.length}
          hint={`Across ${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`}
          icon={Package}
        />
        <StatCard
          label="Active rentals"
          value={activeRentals}
          hint="Out with customers"
          icon={CalendarClock}
          tone="success"
        />
        <StatCard
          label="Paid revenue"
          value={formatCurrency(paidRevenue)}
          hint="From confirmed payments"
          icon={Wallet}
          tone="warning"
        />
        <StatCard
          label="Pending review"
          value={pendingReview.length}
          hint="Awaiting admin approval"
          icon={ClipboardList}
          tone="danger"
        />
        <StatCard
          label="Completed rentals"
          value={analytics?.completedRentals ?? 0}
          hint="Finished bookings"
          icon={CheckCircle2}
        />
        <StatCard
          label="Total earnings"
          value={formatCurrency(analytics?.totalEarnings ?? paidRevenue)}
          hint="Lifetime paid rentals"
          icon={Wallet}
          tone="brand"
        />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Card className="gap-4">
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base">Revenue overview</CardTitle>
                <CardDescription>
                  Rental income over the last 6 months.
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="font-heading text-xl font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="size-3.5" />
                  Last 6 months
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {monthlyRevenue.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No revenue data yet.
                </p>
              ) : (
                <div className="flex h-48 items-end gap-3 pt-6 sm:gap-4">
                  {monthlyRevenue.map((month, index) => {
                    const isLatest = index === monthlyRevenue.length - 1;

                    return (
                      <div
                        key={month.month}
                        className="flex h-full flex-1 flex-col justify-end gap-2"
                      >
                        <div className="group relative flex flex-1 items-end">
                          <div
                            className={cn(
                              "w-full rounded-t-lg transition-colors",
                              isLatest
                                ? "bg-brand"
                                : "bg-brand/20 group-hover:bg-brand/40",
                            )}
                            style={{
                              height: `${Math.round((month.amount / maxRevenue) * 100)}%`,
                            }}
                            title={`${month.month}: ${formatCurrency(month.amount)}`}
                          />
                          <span
                            className={cn(
                              "absolute inset-x-0 -top-6 text-center text-[11px] font-medium",
                              isLatest
                                ? "text-foreground"
                                : "text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
                            )}
                          >
                            {formatCompactCurrency(month.amount)}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-center text-xs",
                            isLatest
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {month.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gap-0 overflow-hidden">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base">Recent rentals</CardTitle>
                <CardDescription>
                  Latest booking requests and active rentals.
                </CardDescription>
              </div>
              <Link
                href="/dashboard/my-equipment-rentals"
                className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
              >
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </CardHeader>
            <div className="divide-y divide-border/70">
              {recentRentals.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No rentals yet. Bookings will appear here.
                </p>
              ) : (
                recentRentals.map((rental) => {
                  const bookingMeta = bookingStatusMeta[rental.bookingStatus];

                  return (
                    <div
                      key={rental.id}
                      className="flex flex-wrap items-center gap-3 px-6 py-3.5 transition-colors hover:bg-secondary/30"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                        {getInitials(rental.customer.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {rental.customer.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {rental.equipmentName} ·{" "}
                          {formatDateRange(rental.startDate, rental.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(rental.bookingAmount)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Qty {rental.quantity}
                        </p>
                      </div>
                      <StatusBadge
                        label={bookingMeta.label}
                        tone={bookingMeta.tone}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="gap-0 overflow-hidden">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base">Pending review</CardTitle>
                <CardDescription>
                  Listings waiting for approval.
                </CardDescription>
              </div>
              <StatusBadge
                label={`${pendingReview.length} items`}
                tone="warning"
              />
            </CardHeader>
            <div className="divide-y divide-border/70">
              {pendingReview.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Nothing is waiting for review.
                </p>
              ) : (
                pendingReview.slice(0, 4).map((equipment) => {
                  const statusMeta = equipmentStatusMeta[equipment.status];

                  return (
                    <div
                      key={equipment.id}
                      className="flex items-center gap-3 px-6 py-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={equipment.image}
                        alt={equipment.name}
                        className="size-9 shrink-0 rounded-lg bg-secondary object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {equipment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {equipment.category}
                        </p>
                      </div>
                      <StatusBadge
                        label={statusMeta.label}
                        tone={statusMeta.tone}
                      />
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-border/70 p-4">
              <Link
                href="/dashboard/my-equipment"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "w-full",
                )}
              >
                Manage equipment
                <ArrowUpRight />
              </Link>
            </div>
          </Card>

          <Card className="gap-4">
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
              <CardDescription>Jump straight to common tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  href: "/dashboard/add-equipment",
                  label: "List new equipment",
                  icon: PackagePlus,
                },
                {
                  href: "/dashboard/my-equipment",
                  label: "Manage my equipment",
                  icon: Package,
                },
                {
                  href: "/dashboard/my-equipment-rentals",
                  label: "Review rental requests",
                  icon: ClipboardList,
                },
                {
                  href: "/dashboard/my-profile",
                  label: "Update my profile",
                  icon: UserRound,
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5 text-sm transition-colors hover:border-brand/30 hover:bg-brand/5"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-secondary text-muted-foreground">
                    <action.icon className="size-4" />
                  </span>
                  <span className="flex-1 font-medium">{action.label}</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
