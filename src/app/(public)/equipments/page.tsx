import type { Metadata } from "next";
import { Suspense } from "react";

import EquipmentBrowser from "@/components/public/equipment/EquipmentBrowser";
import { EquipmentCardSkeleton } from "@/components/public/home/EquipmentCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
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
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <div className="flex items-start gap-8">
            <div className="hidden w-64 shrink-0 space-y-6 rounded-2xl border border-border bg-card p-5 lg:block">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
            <div className="grid flex-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <EquipmentCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <EquipmentBrowser items={items} />
    </Suspense>
  );
};

export default EquipmentsPage;
