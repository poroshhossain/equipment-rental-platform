import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EquipmentForm from "@/components/dashboard/owner/EquipmentForm";
import { getEquipmentById } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "Update equipment | EquipRent",
  description: "Update the details of any rental listing.",
};

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

interface EditAdminEquipmentPageProps {
  params: Promise<{ id: string }>;
}

const EditAdminEquipmentPage = async ({
  params,
}: EditAdminEquipmentPageProps) => {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    notFound();
  }

  return (
    <EquipmentForm
      equipment={equipment}
      owner={equipment.owner ?? null}
      redirectTo="/dashboard/all-equipment"
    />
  );
};

export default EditAdminEquipmentPage;
