"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Heart, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import RecordDetails from "@/components/dashboard/RecordDetails";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFavorites, removeFavorite } from "@/lib/api/ownerAction";
import { authClient } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/format";
import type { Equipment } from "@/lib/types";

const headings = [
  "Equipment",
  "Category",
  "Rental price",
  "Availability",
  "Actions",
];

export default function FavoritesView() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id ?? "";
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    getFavorites(userId)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (equipment: Equipment) => {
    try {
      await removeFavorite(userId, equipment.id);
      setItems((current) =>
        current.filter((item) => item.id !== equipment.id),
      );
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not remove favorite.",
      );
    }
  };

  if (isPending || loading) {
    return <p className="text-sm text-muted-foreground">Loading favorites…</p>;
  }

  if (!userId) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <Heart className="mx-auto mb-3 size-8 text-muted-foreground" />
        <h2 className="font-semibold">No favorites yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Save equipment you like to find it quickly here.
        </p>
        <Link href="/equipments" className={`${buttonVariants({ variant: "brand" })} mt-5`}>
          Browse equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/40 hover:bg-secondary/40">
            {headings.map((heading) => (
              <TableHead key={heading} className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-secondary/30">
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-10 shrink-0 rounded-lg bg-secondary object-cover"
                  />
                  <div className="min-w-0">
                    <p className="max-w-56 truncate text-sm font-medium">
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
              <TableCell className="px-4 py-3">
                <StatusBadge
                  label={item.availableQuantity > 0 ? "Available" : "Out of stock"}
                  tone={item.availableQuantity > 0 ? "success" : "danger"}
                />
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label={`Actions for ${item.name}`}>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLinkItem href={`/equipments/${item.id}`}>
                      <Eye />
                      View details
                    </DropdownMenuLinkItem>
                    <RecordDetails record={item} title={item.name} asMenu />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
                      onClick={() => handleRemove(item)}
                    >
                      <Trash2 />
                      Remove favorite
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
