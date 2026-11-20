import type { Metadata } from "next";

import RoleGuard from "@/components/auth/RoleGuard";
import PageHeader from "@/components/dashboard/PageHeader";
import AdminEquipmentTable from "@/components/dashboard/admin/AdminEquipmentTable";

export const metadata: Metadata = {
  title: "All equipment | EquipRent",
  description: "Approve, reject and manage every listing.",
};

const AllEquipmentPage = () => {
  return (
    <RoleGuard role="admin">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Admin dashboard"
          title="All equipment"
          description="Review pending listings and keep approved equipment up to date."
        />
        <AdminEquipmentTable />
      </div>
    </RoleGuard>
  );
};

export default AllEquipmentPage;
