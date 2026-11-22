"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createCheckout } from "@/lib/api/ownerAction";

export default function PayWithStripe({ bookingId }: { bookingId: string }) {
  const [busy, setBusy] = useState(false);

  const handleCheckout = async () => {
    setBusy(true);
    try {
      const checkout = await createCheckout(bookingId);
      if (checkout.url) {
        window.location.assign(checkout.url);
        return;
      }
      toast.info("Checkout is unavailable right now", {
        description: "Please try again later — your booking is saved as pending.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start checkout.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="brand" size="lg" onClick={handleCheckout} disabled={busy}>
      {busy ? <Loader2 className="animate-spin" /> : <CreditCard />}
      {busy ? "Opening Stripe…" : "Pay securely with Stripe"}
    </Button>
  );
}
