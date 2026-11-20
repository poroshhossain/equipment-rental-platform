import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, CalendarCheck, CheckCircle2, Clock3, Users, Wallet } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { buttonVariants } from "@/components/ui/button";
import {
  getAdminAnalytics,
  getAdminEquipment,
  getAdminRentals,
  getAdminUsers,
} from "@/lib/api/ownerAction";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin dashboard | EquipRent",
  description: "Monitor users, equipment and rentals.",
};

export const instant = false;

const AdminDashboardPage = async () => {
  const [users, equipment, rentals, analytics] = await Promise.all([
    getAdminUsers(),
    getAdminEquipment(),
    getAdminRentals(),
    getAdminAnalytics(),
  ]);

  const monthly = analytics?.monthlyBookings ?? [];
  const maxCount = Math.max(1, ...monthly.map((item) => item.count));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin dashboard"
        title="Platform overview"
        description="A snapshot of accounts, listings, bookings and revenue."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total users"
          value={analytics?.totalUsers ?? users.length}
          hint="Registered accounts"
          icon={Users}
        />
        <StatCard
          label="Total equipment"
          value={analytics?.totalEquipment ?? equipment.length}
          hint="All listings"
          icon={Boxes}
          tone="brand"
        />
        <StatCard
          label="Total bookings"
          value={analytics?.totalBookings ?? rentals.length}
          hint="Across the platform"
          icon={CalendarCheck}
          tone="success"
        />
        <StatCard
          label="Pending approvals"
          value={analytics?.pendingApprovals ?? 0}
          hint="Listings awaiting review"
          icon={Clock3}
          tone="warning"
        />
        <StatCard
          label="Completed rentals"
          value={analytics?.completedRentals ?? 0}
          hint="Finished bookings"
          icon={CheckCircle2}
        />
        <StatCard
          label="Total revenue"
          value={formatCurrency(analytics?.totalRevenue ?? 0)}
          hint="From paid transactions"
          icon={Wallet}
          tone="warning"
        />
      </div>

      {monthly.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Bookings per month</h2>
          <div className="mt-5 flex h-40 items-end gap-3">
            {monthly.map((item) => (
              <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div
                  className="w-full rounded-t-lg bg-brand/70"
                  style={{ height: `${Math.round((item.count / maxCount) * 100)}%` }}
                  title={`${item.month}: ${item.count} booking(s)`}
                />
                <span className="text-center text-xs text-muted-foreground">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/all-users" className={buttonVariants({ variant: "outline" })}>
          <Users />
          All users
        </Link>
        <Link href="/dashboard/all-equipment" className={buttonVariants({ variant: "outline" })}>
          <Boxes />
          All equipment
        </Link>
        <Link href="/dashboard/all-rentals" className={buttonVariants({ variant: "brand" })}>
          <CalendarCheck />
          All rentals
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
