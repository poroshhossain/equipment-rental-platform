import type { Metadata } from "next";

import PageHeader from "@/components/dashboard/PageHeader";
import FavoritesView from "@/components/dashboard/customer/FavoritesView";

export const metadata: Metadata = {
  title: "Favorites | EquipRent",
  description: "Equipment you saved for later.",
};

const FavoritesPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Customer dashboard"
        title="My favorites"
        description="Equipment you saved while browsing, ready when you are."
      />
      <FavoritesView />
    </div>
  );
};

export default FavoritesPage;
