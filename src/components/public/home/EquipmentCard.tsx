"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/format";
import { rentalTypeLabels, type Equipment } from "@/lib/types";

export default function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const openDetails = () => {
    const href = `/equipments/${equipment.id}`;
    router.push(
      session?.user ? href : `/login?next=${encodeURIComponent(href)}`,
    );
  };

  return (
    <motion.article
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={equipment.image}
          alt={equipment.name}
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground">
          {equipment.category}
        </span>
        <span
          className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            equipment.availableQuantity > 0
              ? "bg-success/90 text-white"
              : "bg-destructive/90 text-white"
          }`}
        >
          {equipment.availableQuantity > 0 ? "Available" : "Out of stock"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 font-semibold">{equipment.name}</h3>
          <p className="text-xs text-muted-foreground">
            {equipment.brand} · {equipment.model}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {equipment.location || "Location on request"}
          </span>
          <span className="flex items-center gap-1">
            <Package className="size-3.5" />
            {equipment.availableQuantity} available
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/70 pt-3">
          <div>
            <p className="font-heading text-lg font-bold text-brand">
              {formatCurrency(equipment.rentalPrice)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              per {rentalTypeLabels[equipment.rentalType].toLowerCase()}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={openDetails}>
            View details
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
