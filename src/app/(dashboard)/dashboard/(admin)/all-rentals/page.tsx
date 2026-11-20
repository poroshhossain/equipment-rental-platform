import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import AdminRentalsTable from "@/components/dashboard/admin/AdminRentalsTable";

export const metadata: Metadata = {
  title: "All rentals | EquipRent",
  description: "Monitor every booking on the platform.",
};

const AllRentalsPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin dashboard"
        title="All rentals"
        description="Track every booking, its payment and its current status."
      />
      <AdminRentalsTable />
    </div>
  );
};

export default AllRentalsPage;
