import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import UsersTable from "@/components/dashboard/admin/UsersTable";

export const instant = false;

export const metadata: Metadata = {
  title: "All users | EquipRent",
  description: "Manage registered accounts and their roles.",
};

const AllUsersPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin dashboard"
        title="All users"
        description="Review accounts, change roles and manage access."
      />
      <UsersTable />
    </div>
  );
};

export default AllUsersPage;
