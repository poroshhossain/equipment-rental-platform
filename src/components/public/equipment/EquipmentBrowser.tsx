"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import EquipmentCard from "@/components/public/home/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsivePagination } from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  EQUIPMENT_CATEGORIES,
  RENTAL_TYPE_OPTIONS,
  type Equipment,
} from "@/lib/types";

const PAGE_SIZE = 9;

const FILTER_KEYS = [
  "q",
  "category",
  "rentalType",
  "minPrice",
  "maxPrice",
  "availability",
  "sort",
] as const;

const FILTER_LABELS: Record<string, string> = {
  q: "Search",
  category: "Category",
  rentalType: "Rental type",
  minPrice: "Min price",
  maxPrice: "Max price",
  availability: "Availability",
  sort: "Sort",
};

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Any" },
  { value: "in-stock", label: "Available now" },
  { value: "out-of-stock", label: "Out of stock" },
];

const SORT_OPTIONS = [
  { value: "", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "recent", label: "Recently added" },
];

const selectClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground";

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

interface FilterPanelProps {
  values: Record<string, string>;
  search: string;
  minPrice: string;
  maxPrice: string;
  onSearchChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  activeCount: number;
}

function FilterPanel({
  values,
  search,
  minPrice,
  maxPrice,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onChange,
  onClear,
  activeCount,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Filters</h2>
          {activeCount > 0 ? (
            <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
              {activeCount}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onClear}
          disabled={activeCount === 0}
        >
          <RotateCcw />
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <label htmlFor="catalog-search" className="text-xs font-medium text-muted-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="catalog-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Name or location…"
            className="h-9 pl-9"
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-medium text-muted-foreground">
          Category
        </legend>
        <div className="space-y-1">
          {[{ value: "", label: "All categories" }].concat(
            EQUIPMENT_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            })),
          ).map((option) => {
            const active = (values.category ?? "") === option.value;
            return (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => onChange("category", option.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-brand/10 font-medium text-brand"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {option.label}
                {active ? <Check className="size-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-medium text-muted-foreground">
          Rental type
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {[{ value: "", label: "Any" }].concat(RENTAL_TYPE_OPTIONS).map((option) => {
            const active = (values.rentalType ?? "") === option.value;
            return (
              <button
                key={option.value || "any"}
                type="button"
                onClick={() => onChange("rentalType", option.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  active
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-medium text-muted-foreground">
          Price range
        </legend>
        <div className="flex items-center gap-2">
          <Input
            aria-label="Minimum price"
            type="number"
            min={0}
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
            placeholder="Min"
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            aria-label="Maximum price"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder="Max"
            className="h-9"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-medium text-muted-foreground">
          Availability
        </legend>
        <div className="space-y-1">
          {AVAILABILITY_OPTIONS.map((option) => {
            const active = (values.availability ?? "") === option.value;
            return (
              <button
                key={option.value || "any"}
                type="button"
                onClick={() => onChange("availability", option.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-brand/10 font-medium text-brand"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {option.label}
                {active ? <Check className="size-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

export default function EquipmentBrowser({ items }: { items: Equipment[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const values = Object.fromEntries(params.entries()) as Record<string, string>;
  const [search, setSearch] = useState(values.q ?? "");
  const [minPrice, setMinPrice] = useState(values.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(values.maxPrice ?? "");

  // Keep the inputs in sync when the user navigates back/forward.
  useEffect(() => {
    const syncFromUrl = () => {
      const current = new URLSearchParams(window.location.search);
      setSearch(current.get("q") ?? "");
      setMinPrice(current.get("minPrice") ?? "");
      setMaxPrice(current.get("maxPrice") ?? "");
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const query = next.toString();
      router.push(query ? `/equipments?${query}` : "/equipments", {
        scroll: false,
      });
    },
    [params, router],
  );

  const debouncedSearch = useDebounced(search, 300);
  const debouncedMin = useDebounced(minPrice, 400);
  const debouncedMax = useDebounced(maxPrice, 400);

  useEffect(() => {
    if ((values.q ?? "") !== debouncedSearch.trim()) {
      updateParam("q", debouncedSearch.trim());
    }
  }, [debouncedSearch, values.q, updateParam]);

  useEffect(() => {
    if ((values.minPrice ?? "") !== debouncedMin.trim()) {
      updateParam("minPrice", debouncedMin.trim());
    }
  }, [debouncedMin, values.minPrice, updateParam]);

  useEffect(() => {
    if ((values.maxPrice ?? "") !== debouncedMax.trim()) {
      updateParam("maxPrice", debouncedMax.trim());
    }
  }, [debouncedMax, values.maxPrice, updateParam]);

  const clearAll = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/equipments", { scroll: false });
  };

  const activeFilters = FILTER_KEYS.filter((key) => values[key]);
  const activeCount = activeFilters.length;

  // Keying the page by the active filters resets to page 1 whenever they change.
  const filterKey = params.toString();
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const requestedPage = pageState.key === filterKey ? pageState.page : 1;
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, items.length);
  const pageItems = items.slice(start, end);
  const setPage = (next: number) => setPageState({ key: filterKey, page: next });

  const panelProps: FilterPanelProps = {
    values,
    search,
    minPrice,
    maxPrice,
    onSearchChange: setSearch,
    onMinPriceChange: setMinPrice,
    onMaxPriceChange: setMaxPrice,
    onChange: updateParam,
    onClear: clearAll,
    activeCount,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success" />
          Verified owners
        </div>
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          All equipment
        </h1>
        <p className="text-sm text-muted-foreground">
          Search, filter and compare approved listings from verified owners.
        </p>
      </div>

      <div className="flex items-start gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        <section className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-lg font-semibold">
                {items.length} {items.length === 1 ? "item" : "items"} found
              </p>
              <p className="text-xs text-muted-foreground">
                Browse equipment available near you
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full lg:hidden sm:w-auto"
                onClick={() => setMobileOpen(true)}
              >
                <SlidersHorizontal />
                Filters
                {activeCount > 0 ? (
                  <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
                    {activeCount}
                  </span>
                ) : null}
              </Button>
              <select
                aria-label="Sort equipment"
                value={values.sort ?? ""}
                onChange={(event) => updateParam("sort", event.target.value)}
                className={cn(selectClass, "h-9 w-full sm:w-auto sm:min-w-40")}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeCount > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    updateParam(key, "");
                    if (key === "q") setSearch("");
                    if (key === "minPrice") setMinPrice("");
                    if (key === "maxPrice") setMaxPrice("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
                >
                  <span className="max-w-40 truncate">
                    {FILTER_LABELS[key]}: {values[key]}
                  </span>
                  <X className="size-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="px-2 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Clear all
              </button>
            </div>
          ) : null}

          {items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
              <h2 className="font-heading text-lg font-semibold">
                No equipment matched your filters
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term or clear the filters.
              </p>
              <Button variant="brand" className="mt-5" onClick={clearAll}>
                <RotateCcw />
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          )}

          {pageCount > 1 ? (
            <div className="flex flex-col items-center gap-3 border-t border-border/70 px-1 pt-5 pb-1 text-center sm:flex-row sm:justify-between sm:px-0 sm:pb-0 sm:text-left">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">{start + 1}</span>{" "}
                – <span className="font-medium text-foreground">{end}</span> of{" "}
                <span className="font-medium text-foreground">{items.length}</span>{" "}
                items
              </p>
              <ResponsivePagination
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </section>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(22rem,90vw)] p-0">
          <SheetHeader className="border-b border-border/70 px-5 py-4">
            <SheetTitle>Filter equipment</SheetTitle>
            <SheetDescription>
              Narrow down listings to find the right fit.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-5">
            <FilterPanel {...panelProps} />
          </div>
          <div className="border-t border-border/70 p-4">
            <Button
              type="button"
              variant="brand"
              className="w-full"
              onClick={() => setMobileOpen(false)}
            >
              Show {items.length} {items.length === 1 ? "item" : "items"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
