"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Clock,
  Eye,
  MapPin,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import EmptyState from "@/components/dashboard/EmptyState";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteEquipment } from "@/lib/api/ownerAction";
import {
  formatCurrency,
  formatDate,
  getInitials,
} from "@/lib/format";
import {
  EQUIPMENT_CATEGORIES,
  conditionLabels,
  equipmentStatusMeta,
  rentalTypeLabels,
  rentalTypeSuffixes,
  type Equipment,
  type EquipmentStatus,
  type OwnerProfile,
} from "@/lib/types";

const ALL = "all";

interface EquipmentTableProps {
  equipment: Equipment[];
  owner: OwnerProfile | null;
}

export default function EquipmentTable({
  equipment,
  owner,
}: EquipmentTableProps) {
  const [items, setItems] = useState<Equipment[]>(equipment);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState<EquipmentStatus | typeof ALL>(ALL);
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      const matchesCategory = category === ALL || item.category === category;
      const matchesStatus = status === ALL || item.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [items, search, category, status]);

  const totalUnits = items.reduce(
    (total, item) => total + item.availableQuantity,
    0,
  );
  const pendingCount = items.filter((item) => item.status === "pending").length;
  const approvedCount = items.filter((item) => item.status === "approved").length;

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const removedItem = deleteTarget;

    try {
      await deleteEquipment(removedItem.id);
      setItems((current) =>
        current.filter((item) => item.id !== removedItem.id),
      );
      setDeleteTarget(null);
      toast.success("Equipment deleted", {
        description: `${removedItem.name} was removed from your listings.`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete equipment.",
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total listings"
          value={items.length}
          hint="Across all categories"
          icon={Boxes}
        />
        <StatCard
          label="Available units"
          value={totalUnits}
          hint="Ready to rent"
          icon={Package}
          tone="success"
        />
        <StatCard
          label="Pending review"
          value={pendingCount}
          hint="Awaiting admin approval"
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          hint="Visible to customers"
          icon={Package}
          tone="brand"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, brand or model…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-9 pl-9"
                aria-label="Search equipment"
              />
            </div>

            <Select
              items={[
                { value: ALL, label: "All categories" },
                ...EQUIPMENT_CATEGORIES.map((value) => ({
                  value,
                  label: value,
                })),
              ]}
              value={category}
              onValueChange={(value) => setCategory(value ?? ALL)}
            >
              <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Filter by category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All categories</SelectItem>
                {EQUIPMENT_CATEGORIES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={[
                { value: ALL, label: "All status" },
                ...(
                  Object.entries(equipmentStatusMeta) as [
                    EquipmentStatus,
                    { label: string },
                  ][]
                ).map(([value, meta]) => ({ value, label: meta.label })),
              ]}
              value={status}
              onValueChange={(value) =>
                setStatus((value as EquipmentStatus | typeof ALL) ?? ALL)
              }
            >
              <SelectTrigger className="h-9 w-full sm:w-36" aria-label="Filter by status">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All status</SelectItem>
                {(
                  Object.entries(equipmentStatusMeta) as [
                    EquipmentStatus,
                    { label: string },
                  ][]
                ).map(([value, meta]) => (
                  <SelectItem key={value} value={value}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="brand"
            size="lg"
            className="shrink-0"
            nativeButton={false}
            render={<Link href="/dashboard/add-equipment" />}
          >
            <Plus />
            Add equipment
          </Button>
        </div>

        {filteredItems.length === 0 ? (
          <EmptyState
            icon={Package}
            title={items.length === 0 ? "No equipment yet" : "No matching equipment"}
            description={
              items.length === 0
                ? "Add your first item to start receiving rental requests."
                : "Try a different search term or clear the filters."
            }
            action={
              items.length === 0 ? (
                <Button
                  variant="brand"
                  nativeButton={false}
                  render={<Link href="/dashboard/add-equipment" />}
                >
                  <Plus />
                  Add equipment
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setCategory(ALL);
                    setStatus(ALL);
                  }}
                >
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Equipment
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Category
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Rental price
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Available
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const statusMeta = equipmentStatusMeta[item.status];

                    return (
                      <TableRow key={item.id} className="hover:bg-secondary/30">
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-11 shrink-0 rounded-lg bg-secondary object-cover"
                            />
                            <div className="min-w-0">
                              <p className="max-w-56 truncate text-sm font-semibold">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.brand} · {item.model}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                          {item.category}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.rentalPrice)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            per {rentalTypeSuffixes[item.rentalType]}
                          </p>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className="text-sm font-medium">
                            {item.availableQuantity}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            / {item.totalQuantity}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <StatusBadge
                            label={statusMeta.label}
                            tone={statusMeta.tone}
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`Actions for ${item.name}`}
                            >
                              <MoreHorizontal />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setSelected(item)}>
                                <Eye />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuLinkItem
                                href={`/dashboard/my-equipment/${item.id}/edit`}
                              >
                                <Pencil />
                                Update
                              </DropdownMenuLinkItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
                                onClick={() => setDeleteTarget(item)}
                              >
                                <Trash2 />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-border/70 md:hidden">
              {filteredItems.map((item) => {
                const statusMeta = equipmentStatusMeta[item.status];

                return (
                  <div key={item.id} className="space-y-3 p-4">
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-14 shrink-0 rounded-lg bg-secondary object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.brand} · {item.model}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <StatusBadge
                            label={statusMeta.label}
                            tone={statusMeta.tone}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-secondary/50 p-2.5">
                        <p className="text-muted-foreground">Rental price</p>
                        <p className="font-semibold">
                          {formatCurrency(item.rentalPrice)} /{" "}
                          {rentalTypeSuffixes[item.rentalType]}
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2.5">
                        <p className="text-muted-foreground">Available</p>
                        <p className="font-semibold">
                          {item.availableQuantity} of {item.totalQuantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-border/70 pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${item.name}`}
                        >
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSelected(item)}>
                            <Eye />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuLinkItem
                            href={`/dashboard/my-equipment/${item.id}/edit`}
                          >
                            <Pencil />
                            Update
                          </DropdownMenuLinkItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredItems.length} of {items.length} listings
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-3.5" />
            Servicing the San Francisco Bay Area
          </span>
        </div>
      </div>

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="w-full data-[side=right]:sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader className="border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <StatusBadge
                    label={equipmentStatusMeta[selected.status].label}
                    tone={equipmentStatusMeta[selected.status].tone}
                  />
                  <span className="text-xs text-muted-foreground">
                    {selected.category}
                  </span>
                </div>
                <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.brand} · {selected.model} · {selected.location}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="aspect-video w-full rounded-lg bg-secondary object-cover"
                />

                <div className="flex items-end justify-between gap-3 rounded-lg bg-secondary/50 p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Rental price
                    </p>
                    <p className="font-heading text-xl font-bold">
                      {formatCurrency(selected.rentalPrice)}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / {rentalTypeSuffixes[selected.rentalType]}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Rental type</p>
                    <p className="text-sm font-medium">
                      {rentalTypeLabels[selected.rentalType]}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-1.5 text-sm font-semibold">Description</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selected.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Available", `${selected.availableQuantity} units`],
                    ["Total quantity", `${selected.totalQuantity} units`],
                    ["Condition", conditionLabels[selected.condition]],
                    ["Listed", selected.createdAt ? formatDate(selected.createdAt) : "—"],
                    ["Brand", selected.brand],
                    ["Model", selected.model],
                    ["Location", selected.location],
                    ["Listing ID", selected.id],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-border/70 p-2.5"
                    >
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="truncate font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-1.5 text-sm font-semibold">
                    Rental terms
                  </h3>
                  <p className="rounded-lg border border-border/70 bg-secondary/30 p-3 text-xs leading-relaxed text-muted-foreground">
                    {selected.terms}
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-border/70 p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                    {getInitials(owner?.name ?? "EquipRent")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {owner?.name ?? "EquipRent"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {owner?.company ?? "Equipment owner"}
                    </p>
                  </div>
                </div>
              </div>

              <SheetFooter className="border-t border-border/70 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/dashboard/my-equipment/${selected.id}/edit`} />}
                >
                  <Pencil />
                  Update listing
                </Button>
                <Button variant="brand" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <span className="mb-2 grid size-10 place-items-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </span>
            <DialogTitle>Delete equipment?</DialogTitle>
            <DialogDescription>
              <strong className="text-foreground">{deleteTarget?.name}</strong>{" "}
              will be removed from your listings. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              <Trash2 />
              Delete equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
