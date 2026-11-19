import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EquipmentForm from "@/components/dashboard/owner/EquipmentForm";
import { fakeEquipment } from "@/lib/owner-data";

export const metadata: Metadata = {
  title: "Update equipment | EquipRent",
  description: "Update the details of your rental listing.",
};

interface EditEquipmentPageProps {
  params: Promise<{ id: string }>;
}

const EditEquipmentPage = async ({ params }: EditEquipmentPageProps) => {
  const { id } = await params;
  const equipment = fakeEquipment.find((item) => item.id === id);

  if (!equipment) {
    notFound();
  }

  return <EquipmentForm equipment={equipment} />;
};

export default EditEquipmentPage;
