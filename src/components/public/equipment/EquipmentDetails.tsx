"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarClock,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";

import BookingModal from "./BookingModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { authClient } from "@/lib/auth-client";
import { addFavorite, getFavorites, removeFavorite } from "@/lib/api/ownerAction";
import { formatCurrency, getInitials } from "@/lib/format";
import {
  conditionLabels,
  equipmentStatusMeta,
  rentalTypeLabels,
  type Equipment,
} from "@/lib/types";

export default function EquipmentDetails({ equipment }: { equipment: Equipment }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? "";
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    getFavorites(userId).then((items) =>
      setSaved(items.some((item) => item.id === equipment.id)),
    );
  }, [userId, equipment.id]);

  const toggleFavorite = async () => {
    if (!userId) return;
    setBusy(true);

    try {
      if (saved) {
        await removeFavorite(userId, equipment.id);
        setSaved(false);
        toast.success("Removed from favorites");
      } else {
        await addFavorite(userId, equipment.id);
        setSaved(true);
        toast.success("Saved to favorites");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update favorites.",
      );
    } finally {
      setBusy(false);
    }
  };

  const statusMeta = equipmentStatusMeta[equipment.status];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <Link
        href="/equipments"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to all equipment
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={equipment.image}
              alt={equipment.name}
              className="aspect-video w-full bg-secondary object-cover"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {equipment.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Category", equipment.category],
                  ["Condition", conditionLabels[equipment.condition]],
                  ["Brand", equipment.brand],
                  ["Model", equipment.model],
                  ["Available units", String(equipment.availableQuantity)],
                  ["Rental type", rentalTypeLabels[equipment.rentalType]],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border/70 p-3"
                  >
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rental terms and conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line rounded-lg bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
                {equipment.terms}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
          <Card>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
                <span className="text-xs text-muted-foreground">
                  {equipment.category}
                </span>
              </div>

              <div>
                <h1 className="font-heading text-2xl font-bold">
                  {equipment.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {equipment.brand} · {equipment.model}
                </p>
              </div>

              <div className="flex items-end justify-between border-y border-border/70 py-4">
                <div>
                  <p className="font-heading text-2xl font-bold text-brand">
                    {formatCurrency(equipment.rentalPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    per {rentalTypeLabels[equipment.rentalType].toLowerCase()}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Package className="size-3.5" />
                  {equipment.availableQuantity} available
                </span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {equipment.location || "Location on request"}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="size-4" />
                  Flexible daily, weekly and monthly rentals
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full"
                  onClick={() => setBookingOpen(true)}
                >
                  Book now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={toggleFavorite}
                  disabled={busy}
                >
                  <Heart className={saved ? "fill-rose-500 text-rose-500" : ""} />
                  {saved ? "Saved to favorites" : "Add to favorites"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Equipment owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  {getInitials(equipment.owner?.name ?? "Owner")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {equipment.owner?.name ?? "Verified owner"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {equipment.owner?.company ?? "EquipRent partner"}
                  </p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-brand" />
                {equipment.owner?.verified
                  ? "Identity and business verified"
                  : "Owner profile on EquipRent"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        equipment={equipment}
        userId={userId}
        customer={{
          name: session?.user?.name ?? "Customer",
          email: session?.user?.email ?? "",
        }}
      />
    </div>
  );
}
