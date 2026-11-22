import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import MyRentalsView from "@/components/dashboard/customer/MyRentalsView";

export const instant = false;

export const metadata: Metadata = {
  title: "My rentals | EquipRent",
  description: "All equipment bookings you have made.",
};

const MyRentalsPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Customer dashboard"
        title="My rentals"
        description="Every booking you made, with dates, totals and current status."
      />
      <MyRentalsView />
    </div>
  );
};

export default MyRentalsPage;
