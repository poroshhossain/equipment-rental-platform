import type { Metadata } from "next";

import AuthGuard from "@/components/public/AuthGuard";
import PaymentSummary from "@/components/public/equipment/PaymentSummary";
import { getBooking } from "@/lib/api/ownerAction";

export const metadata: Metadata = {
  title: "Payment | EquipRent",
  description: "Review your booking and payment total.",
};

export const instant = false;

const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) => {
  const { booking: id } = await searchParams;
  const booking = id ? await getBooking(id) : null;

  return (
    <AuthGuard>
      <PaymentSummary booking={booking} />
    </AuthGuard>
  );
};

export default PaymentPage;
