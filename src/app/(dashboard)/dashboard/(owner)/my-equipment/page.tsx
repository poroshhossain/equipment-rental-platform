import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import EquipmentTable from "@/components/dashboard/owner/EquipmentTable";

export const metadata: Metadata = {
  title: "My equipment | EquipRent",
  description: "Manage the equipment you have listed for rent.",
};

const MyEquipmentPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Owner dashboard"
        title="My equipment"
        description="Track availability, update details and manage every listing in one place."
      />
      <EquipmentTable />
    </div>
  );
};

export default MyEquipmentPage;
