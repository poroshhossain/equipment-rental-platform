import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EquipmentForm from "@/components/dashboard/owner/EquipmentForm";
import { getAllEquipment, getOwnerProfile } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "Update equipment | EquipRent",
  description: "Update the details of your rental listing.",
};

// Live API data is loaded per request; allow the route to block on navigation.
export const instant = false;

interface EditEquipmentPageProps {
  params: Promise<{ id: string }>;
}

const EditEquipmentPage = async ({ params }: EditEquipmentPageProps) => {
  const { id } = await params;
  const [equipmentList, profile] = await Promise.all([
    getAllEquipment(),
    getOwnerProfile(),
  ]);
  const equipment = equipmentList.find((item) => item.id === id);

  if (!equipment) {
    notFound();
  }

  return <EquipmentForm equipment={equipment} owner={profile} />;
};

export default EditEquipmentPage;
