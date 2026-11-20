import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, CalendarCheck, Users } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { buttonVariants } from "@/components/ui/button";
import {
  getAdminEquipment,
  getAdminRentals,
  getAdminUsers,
} from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "Admin dashboard | EquipRent",
  description: "Monitor users, equipment and rentals.",
};

export const instant = false;

const AdminDashboardPage = async () => {
  const [users, equipment, rentals] = await Promise.all([
    getAdminUsers(),
    getAdminEquipment(),
    getAdminRentals(),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin dashboard"
        title="Platform overview"
        description="A snapshot of accounts, listings and rental activity."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={users.length} hint="Registered accounts" icon={Users} />
        <StatCard label="Equipment" value={equipment.length} hint="All listings" icon={Boxes} tone="brand" />
        <StatCard label="Rentals" value={rentals.length} hint="All bookings" icon={CalendarCheck} tone="success" />
      </div>

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
