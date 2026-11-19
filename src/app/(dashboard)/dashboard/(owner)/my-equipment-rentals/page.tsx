import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import RentalsTable from "@/components/dashboard/owner/RentalsTable";

export const metadata: Metadata = {
  title: "My equipment rental | EquipRent",
  description: "Track bookings, payments and rental status for your equipment.",
};

const MyEquipmentRentalPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Owner dashboard"
        title="My equipment rental"
        description="Every booking made against your equipment, with payment and booking status in real time."
      />
      <RentalsTable />
    </div>
  );
};

export default MyEquipmentRentalPage;
