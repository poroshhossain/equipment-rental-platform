"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EQUIPMENT_CATEGORIES, RENTAL_TYPE_OPTIONS } from "@/lib/types";

const selectClass =
  "h-9 rounded-lg border border-border bg-background px-3 text-sm";
const labelClass = "mb-1.5 block text-xs font-medium text-muted-foreground";

const fields = [
  "q",
  "category",
  "rentalType",
  "minPrice",
  "maxPrice",
  "availability",
  "sort",
] as const;

export default function EquipmentFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const apply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();

    fields.forEach((field) => {
      const value = String(data.get(field) ?? "").trim();
      if (value) next.set(field, value);
    });

    router.push(`/equipments${next.size ? `?${next.toString()}` : ""}`);
  };

  return (
    <form
      key={params.toString()}
      onSubmit={apply}
      className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="filter-q">
          Search by name or location
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="filter-q"
            name="q"
            defaultValue={params.get("q") ?? ""}
            placeholder="e.g. excavator or Oakland"
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-category">
          Category
        </label>
        <select
          id="filter-category"
          name="category"
          defaultValue={params.get("category") ?? ""}
          className={`${selectClass} w-full`}
        >
          <option value="">All categories</option>
          {EQUIPMENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-rental-type">
          Rental type
        </label>
        <select
          id="filter-rental-type"
          name="rentalType"
          defaultValue={params.get("rentalType") ?? ""}
          className={`${selectClass} w-full`}
        >
          <option value="">Any rental type</option>
          {RENTAL_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-min-price">
          Min price ($)
        </label>
        <Input
          id="filter-min-price"
          name="minPrice"
          type="number"
          min={0}
          defaultValue={params.get("minPrice") ?? ""}
          placeholder="0"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-max-price">
          Max price ($)
        </label>
        <Input
          id="filter-max-price"
          name="maxPrice"
          type="number"
          min={0}
          defaultValue={params.get("maxPrice") ?? ""}
          placeholder="Any"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-availability">
          Availability
        </label>
        <select
          id="filter-availability"
          name="availability"
          defaultValue={params.get("availability") ?? ""}
          className={`${selectClass} w-full`}
        >
          <option value="">Any availability</option>
          <option value="in-stock">Available now</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-sort">
          Sort by
        </label>
        <select
          id="filter-sort"
          name="sort"
          defaultValue={params.get("sort") ?? ""}
          className={`${selectClass} w-full`}
        >
          <option value="">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="recent">Recently added</option>
        </select>
      </div>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
        <Button type="submit" variant="brand">
          Apply filters
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/equipments")}
        >
          <RotateCcw />
          Clear
        </Button>
      </div>
    </form>
  );
}
