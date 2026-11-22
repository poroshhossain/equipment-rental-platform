import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import RentalsTable from "@/components/dashboard/owner/RentalsTable";
import { getOwnerProfile, getOwnerRentals } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "My equipment rental | EquipRent",
  description: "Track bookings, payments and rental status for your equipment.",
};

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

const MyEquipmentRentalPage = async () => {
  const profile = await getOwnerProfile();
  const rentals = await getOwnerRentals(profile?.email ?? "");

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Owner dashboard"
        title="My equipment rental"
        description="Every booking made against your equipment, with payment and booking status in real time."
      />
      <RentalsTable rentals={rentals} />
    </div>
  );
};

export default MyEquipmentRentalPage;
