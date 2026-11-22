"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
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
import { createBooking, createCheckout } from "@/lib/api/ownerAction";
import { formatCurrency, getDurationInDays } from "@/lib/format";
import { rentalTypeLabels, type Equipment } from "@/lib/types";

const DAYS_PER_UNIT = { daily: 1, weekly: 7, monthly: 30 } as const;

interface BookingForm {
  startDate: string;
  endDate: string;
  quantity: string;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof BookingForm, string>>;

const INITIAL_FORM: BookingForm = {
  startDate: "",
  endDate: "",
  quantity: "1",
  contactNumber: "",
  deliveryAddress: "",
  notes: "",
};

/** Local calendar date in `YYYY-MM-DD` format, safe for `<input type="date">`. */
function todayInputValue(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function validateBooking(
  form: BookingForm,
  availableQuantity: number,
  today: string,
): FormErrors {
  const errors: FormErrors = {};

  if (form.startDate && form.startDate < today) {
    errors.startDate = "Start date cannot be in the past.";
  }
  if (form.endDate) {
    if (form.endDate < today) {
      errors.endDate = "End date cannot be in the past.";
    } else if (form.startDate && form.endDate < form.startDate) {
      errors.endDate = "End date must be on or after the start date.";
    }
  }

  const requested = Number(form.quantity);
  if (!form.quantity.trim() || !Number.isInteger(requested)) {
    errors.quantity = "Enter a valid quantity.";
  } else if (requested < 1) {
    errors.quantity = "Quantity must be at least 1.";
  } else if (requested > availableQuantity) {
    errors.quantity = `Only ${availableQuantity} unit(s) available.`;
  }

  return errors;
}

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
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState<BookingForm>(INITIAL_FORM);

  const today = todayInputValue();
  const errors = validateBooking(form, equipment.availableQuantity, today);
  const firstError = errors.startDate ?? errors.endDate ?? errors.quantity;
  const hasValidDates = Boolean(form.startDate && form.endDate) && !errors.startDate && !errors.endDate;

  const days = hasValidDates ? getDurationInDays(form.startDate, form.endDate) : 0;
  const units = Math.max(1, Math.ceil(days / DAYS_PER_UNIT[equipment.rentalType]));
  const requestedQuantity = Number(form.quantity);
  const quantity = Math.min(
    Math.max(1, Number.isInteger(requestedQuantity) ? requestedQuantity : 1),
    Math.max(1, equipment.availableQuantity),
  );
  const total = units * equipment.rentalPrice * quantity;

  const update = (field: keyof BookingForm, value: string) => {
    setShowErrors(true);
    setForm((current) => ({ ...current, [field]: value }));
  };

  // Keep the end date in sync when a later start date is selected.
  const updateStartDate = (value: string) => {
    setShowErrors(true);
    setForm((current) => ({
      ...current,
      startDate: value,
      endDate: current.endDate && value && current.endDate < value ? "" : current.endDate,
    }));
  };

  const errorProps = (field: keyof BookingForm) => {
    const message = showErrors ? errors[field] : undefined;
    return {
      "aria-invalid": Boolean(message),
      "aria-describedby": message ? `${field}-error` : undefined,
    };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowErrors(true);
    if (firstError) {
      toast.error(firstError);
      return;
    }
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

      onOpenChange(false);

      // Take the renter straight to Stripe Checkout; the payment page is the
      // fallback if Stripe is unavailable or session creation fails.
      try {
        const checkout = await createCheckout(booking.id, userId);
        if (checkout.url) {
          window.location.assign(checkout.url);
          return;
        }
        toast.info("Stripe is not configured yet", {
          description: "Add STRIPE_SECRET_KEY to enable secure checkout.",
        });
      } catch (error) {
        toast.info("Booking saved", {
          description:
            error instanceof Error
              ? error.message
              : "You can complete the payment on the next page.",
        });
      }

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
                min={today}
                required
                value={form.startDate}
                onChange={(event) => updateStartDate(event.target.value)}
                {...errorProps("startDate")}
              />
              {showErrors ? (
                <FieldError id="startDate-error" message={errors.startDate} />
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Rental end date</Label>
              <Input
                id="end-date"
                type="date"
                min={form.startDate || today}
                required
                value={form.endDate}
                onChange={(event) => update("endDate", event.target.value)}
                {...errorProps("endDate")}
              />
              {showErrors ? (
                <FieldError id="endDate-error" message={errors.endDate} />
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Required quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={equipment.availableQuantity}
              step={1}
              required
              value={form.quantity}
              onChange={(event) => update("quantity", event.target.value)}
              {...errorProps("quantity")}
            />
            {showErrors ? (
              <FieldError id="quantity-error" message={errors.quantity} />
            ) : null}
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
