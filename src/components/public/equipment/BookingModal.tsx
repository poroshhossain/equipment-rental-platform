"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/lib/api/ownerAction";
import { formatCurrency, getDurationInDays } from "@/lib/format";
import { rentalTypeLabels, type Equipment } from "@/lib/types";

const DAYS_PER_UNIT = { daily: 1, weekly: 7, monthly: 30 } as const;

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment;
  userId: string;
  customer: { name: string; email: string };
}

export default function BookingModal({
  open,
  onOpenChange,
  equipment,
  userId,
  customer,
}: BookingModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    quantity: "1",
    contactNumber: "",
    deliveryAddress: "",
    notes: "",
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const days =
    form.startDate && form.endDate
      ? getDurationInDays(form.startDate, form.endDate)
      : 0;
  const units = Math.max(1, Math.ceil(days / DAYS_PER_UNIT[equipment.rentalType]));
  const quantity = Math.max(1, Number(form.quantity) || 1);
  const total = units * equipment.rentalPrice * quantity;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const booking = await createBooking({
        equipmentId: equipment.id,
        userId,
        startDate: form.startDate,
        endDate: form.endDate,
        quantity,
        contactNumber: form.contactNumber,
        deliveryAddress: form.deliveryAddress,
        notes: form.notes,
        customer,
      });

      toast.success("Booking confirmed", {
        description: "Review the total on the payment page.",
      });
      onOpenChange(false);
      router.push(`/payment?booking=${booking.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create booking.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {equipment.name}</DialogTitle>
          <DialogDescription>
            {formatCurrency(equipment.rentalPrice)} per{" "}
            {rentalTypeLabels[equipment.rentalType].toLowerCase()} ·{" "}
            {equipment.availableQuantity} unit(s) available
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Rental start date</Label>
              <Input
                id="start-date"
                type="date"
                required
                value={form.startDate}
                onChange={(event) => update("startDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Rental end date</Label>
              <Input
                id="end-date"
                type="date"
                required
                value={form.endDate}
                onChange={(event) => update("endDate", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Required quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={equipment.availableQuantity}
              required
              value={form.quantity}
              onChange={(event) => update("quantity", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact number</Label>
            <Input
              id="contact"
              type="tel"
              required
              placeholder="+1 555 000 1234"
              value={form.contactNumber}
              onChange={(event) => update("contactNumber", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery address</Label>
            <Input
              id="address"
              required
              placeholder="Street, city, state"
              value={form.deliveryAddress}
              onChange={(event) => update("deliveryAddress", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Delivery time, access notes…"
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-secondary/60 p-3">
            <span className="text-sm text-muted-foreground">Estimated total</span>
            <span className="font-heading text-lg font-bold text-brand">
              {formatCurrency(total)}
            </span>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" /> : null}
              {submitting ? "Confirming…" : "Confirm booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
