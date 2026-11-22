import type { Metadata } from "next";

import EquipmentForm from "@/components/dashboard/owner/EquipmentForm";
import { getOwnerProfile } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "Add equipment | EquipRent",
  description: "List new equipment for rent on EquipRent.",
};

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

const AddEquipmentPage = async () => {
  const profile = await getOwnerProfile();

  return <EquipmentForm owner={profile} />;
};

export default AddEquipmentPage;
