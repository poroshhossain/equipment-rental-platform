import type { Metadata } from "next";

import OwnerProfileView from "@/components/dashboard/owner/OwnerProfileView";

export const metadata: Metadata = {
  title: "My profile | EquipRent",
  description: "Manage your owner profile and business information.",
};

const MyProfilePage = () => {
  return <OwnerProfileView />;
};

export default MyProfilePage;
