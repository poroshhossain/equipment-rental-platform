import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AuthGuard from "@/components/public/AuthGuard";
import EquipmentDetails from "@/components/public/equipment/EquipmentDetails";
import { getEquipmentById } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "Equipment details | EquipRent",
  description: "View equipment details and book it for your next project.",
};

export const instant = false;

const EquipmentDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) notFound();

  return (
    <AuthGuard>
      <EquipmentDetails equipment={equipment} />
    </AuthGuard>
  );
};

export default EquipmentDetailsPage;
