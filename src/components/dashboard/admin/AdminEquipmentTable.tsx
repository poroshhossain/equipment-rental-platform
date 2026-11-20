"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import RecordDetails from "@/components/dashboard/RecordDetails";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteEquipment,
  getAdminEquipment,
  setEquipmentStatus,
} from "@/lib/api/ownerAction";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  equipmentStatusMeta,
  rentalTypeLabels,
  type Equipment,
  type EquipmentStatus,
} from "@/lib/types";

export default function AdminEquipmentTable() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);

  useEffect(() => {
    getAdminEquipment()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (item: Equipment, status: EquipmentStatus) => {
    try {
      const updated = await setEquipmentStatus(item.id, status);
      setItems((current) =>
        current.map((entry) => (entry.id === updated.id ? updated : entry)),
      );
      toast.success(`${item.name} marked ${status}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update status.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteEquipment(deleteTarget.id);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      toast.success("Equipment deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete equipment.",
      );
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading equipment…</p>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Wide screens: full data table */}
        <div className="hidden xl:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Equipment</TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Category</TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Price</TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Rental type</TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Available</TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Owner</TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Listed</TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Status</TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const meta = equipmentStatusMeta[item.status];

                return (
                  <TableRow key={item.id} className="hover:bg-secondary/30">
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-9 shrink-0 rounded-lg bg-secondary object-cover"
                        />
                        <div className="min-w-0">
                          <p className="max-w-48 truncate text-sm font-medium">
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
                    <TableCell className="px-4 py-3 text-sm font-semibold">
                      {formatCurrency(item.rentalPrice)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {rentalTypeLabels[item.rentalType]}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      {item.availableQuantity} / {item.totalQuantity}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {item.owner?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {item.createdAt ? formatDate(item.createdAt) : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <RecordDetails record={item} title={item.name} />
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={item.status === "approved"}
                          onClick={() => handleStatus(item, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={item.status === "rejected"}
                          onClick={() => handleStatus(item, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Update ${item.name}`}
                          nativeButton={false}
                          render={
                            <Link href={`/dashboard/all-equipment/${item.id}/edit`} />
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Delete ${item.name}`}
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Small / medium screens: stacked cards */}
        <div className="divide-y divide-border/70 xl:hidden">
          {items.map((item) => {
            const meta = equipmentStatusMeta[item.status];

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
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.brand} · {item.model}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                      <span className="text-xs text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-muted-foreground">Price</p>
                    <p className="truncate font-semibold">
                      {formatCurrency(item.rentalPrice)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-muted-foreground">Available</p>
                    <p className="font-semibold">
                      {item.availableQuantity} of {item.totalQuantity}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-muted-foreground">Rental type</p>
                    <p className="truncate font-semibold">
                      {rentalTypeLabels[item.rentalType]}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-muted-foreground">Owner</p>
                    <p className="truncate font-semibold">
                      {item.owner?.name ?? "—"}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-muted-foreground">Listed</p>
                    <p className="font-semibold">
                      {item.createdAt ? formatDate(item.createdAt) : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={item.status === "approved"}
                    onClick={() => handleStatus(item, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={item.status === "rejected"}
                    onClick={() => handleStatus(item, "rejected")}
                  >
                    Reject
                  </Button>
                  <RecordDetails record={item} title={item.name} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    nativeButton={false}
                    render={
                      <Link href={`/dashboard/all-equipment/${item.id}/edit`} />
                    }
                  >
                    <Pencil />
                    Update
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Delete ${item.name}`}
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete equipment?</DialogTitle>
            <DialogDescription>
              <strong className="text-foreground">{deleteTarget?.name}</strong>{" "}
              will be removed permanently. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
