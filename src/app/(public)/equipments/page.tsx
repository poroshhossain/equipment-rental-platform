import type { Metadata } from "next";

import EquipmentCatalog from "@/components/public/home/EquipmentCatalog";
import { getEquipmentList } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "All equipment | EquipRent",
  description: "Browse approved equipment available for rent.",
};

export const instant = false;

const EquipmentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) => {
  const { category } = await searchParams;
  const items = await getEquipmentList({ status: "approved", limit: 50 });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">All equipment</h1>
        <p className="text-sm text-muted-foreground">
          Find the right gear from verified owners.
        </p>
      </div>
      <EquipmentCatalog items={items} initialCategory={category} />
    </div>
  );
};

export default EquipmentsPage;
