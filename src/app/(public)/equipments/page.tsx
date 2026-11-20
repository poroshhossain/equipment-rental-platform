import type { Metadata } from "next";
import { Suspense } from "react";

import EquipmentBrowser from "@/components/public/equipment/EquipmentBrowser";
import { getEquipmentList } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "All equipment | EquipRent",
  description: "Browse approved equipment available for rent.",
};

export const instant = false;

type Filters = {
  q?: string;
  category?: string;
  rentalType?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  sort?: string;
};

const EquipmentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) => {
  const filters = await searchParams;
  const items = await getEquipmentList({
    ...filters,
    status: "approved",
    limit: 50,
  });

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      }
    >
      <EquipmentBrowser items={items} />
    </Suspense>
  );
};

export default EquipmentsPage;
