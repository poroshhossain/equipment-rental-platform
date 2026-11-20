import type { Metadata } from "next";

import OwnerProfileView from "@/components/dashboard/owner/OwnerProfileView";
import {
  getAllEquipment,
  getOwnerProfile,
  getRentals,
} from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "My profile | EquipRent",
  description: "Manage your owner profile and business information.",
};

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

const MyProfilePage = async () => {
  const [equipment, profile, rentals] = await Promise.all([
    getAllEquipment(),
    getOwnerProfile(),
    getRentals(),
  ]);

  return (
    <OwnerProfileView equipment={equipment} profile={profile} rentals={rentals} />
  );
};

export default MyProfilePage;
