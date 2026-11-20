import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import EquipmentTable from "@/components/dashboard/owner/EquipmentTable";
import { getOwnerEquipment, getOwnerProfile } from "@/lib/api/ownerAction";
import { serverToken } from "@/lib/server-token";

export const metadata: Metadata = {
  title: "My equipment | EquipRent",
  description: "Manage the equipment you have listed for rent.",
};

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

const MyEquipmentPage = async () => {
  const token = await serverToken();
  const profile = await getOwnerProfile(token);
  const equipment = await getOwnerEquipment(profile?.email ?? "", token);

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
