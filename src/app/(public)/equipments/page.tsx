import type { Metadata } from "next";
import { Suspense } from "react";

import EquipmentCard from "@/components/public/home/EquipmentCard";
import EquipmentFilters from "@/components/public/home/EquipmentFilters";
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
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">All equipment</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter and compare approved listings from verified owners.
        </p>
      </div>

      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl border border-border bg-card" />}>
        <EquipmentFilters />
      </Suspense>

      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} found
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <h2 className="font-semibold">No equipment matched your filters</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentsPage;
