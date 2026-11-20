"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getFavorites, removeFavorite } from "@/lib/api/ownerAction";
import { formatCurrency } from "@/lib/format";
import type { Equipment } from "@/lib/types";

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

  if (!userId) {
    return (
      <p className="text-sm text-muted-foreground">
        Please <Link href="/login" className="text-brand underline">log in</Link> to see your favorites.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <Heart className="mx-auto mb-3 size-8 text-muted-foreground" />
        <h2 className="font-semibold">No favorites yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Save equipment you like to find it quickly here.
        </p>
        <Link
          href="/equipments"
          className={`${buttonVariants({ variant: "brand" })} mt-5`}
        >
          Browse equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="aspect-video w-full bg-secondary object-cover"
          />
          <div className="space-y-3 p-4">
            <div>
              <p className="truncate font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.category} · {item.brand}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-brand">
                {formatCurrency(item.rentalPrice)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/equipments/${item.id}`} />}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => handleRemove(item)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
