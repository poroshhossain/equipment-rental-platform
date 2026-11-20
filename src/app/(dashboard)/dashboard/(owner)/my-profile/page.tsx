import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = {
  title: "My profile | EquipRent",
  description: "Manage your account details.",
};

const MyProfilePage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="My account"
        title="My profile"
        description="Update the contact details other users see on EquipRent."
      />
      <ProfileForm />
    </div>
  );
};

export default MyProfilePage;
