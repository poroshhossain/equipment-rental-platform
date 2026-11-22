import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import EquipmentTable from "@/components/dashboard/owner/EquipmentTable";
import { getOwnerEquipment, getOwnerProfile } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "My equipment | EquipRent",
  description: "Manage the equipment you have listed for rent.",
};

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

const MyEquipmentPage = async () => {
  const profile = await getOwnerProfile();
  const equipment = await getOwnerEquipment(profile?.email ?? "");

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Owner dashboard"
        title="My equipment"
        description="Track availability, update details and manage every listing in one place."
      />
      <EquipmentTable equipment={equipment} owner={profile} />
    </div>
  );
};

export default MyEquipmentPage;
