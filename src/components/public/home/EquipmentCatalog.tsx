"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import EquipmentCard from "./EquipmentCard";
import { Input } from "@/components/ui/input";
import { EQUIPMENT_CATEGORIES, type Equipment } from "@/lib/types";

const ALL = "all";

export default function EquipmentCatalog({
  items,
  initialCategory = "",
}: {
  items: Equipment[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory || ALL);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query);
      return (
        matchesQuery &&
        (category === ALL || item.category === category)
      );
    });
  }, [items, search, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search equipment…"
            aria-label="Search equipment"
            className="pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value={ALL}>All categories</option>
          {EQUIPMENT_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No equipment matched your filters.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  );
}
