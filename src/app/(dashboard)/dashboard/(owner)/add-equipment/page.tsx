import type { Metadata } from "next";

import EquipmentForm from "@/components/dashboard/owner/EquipmentForm";

export const metadata: Metadata = {
  title: "Add equipment | EquipRent",
  description: "List new equipment for rent on EquipRent.",
};

const AddEquipmentPage = () => {
  return <EquipmentForm />;
};

export default AddEquipmentPage;
