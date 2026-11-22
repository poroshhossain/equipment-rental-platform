import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Search } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Customer dashboard | EquipRent",
  description: "Find, save and rent equipment.",
};

const CustomerDashboardPage = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Customer dashboard"
        title="Welcome to EquipRent"
        description="Browse verified equipment, save your favorites and book in minutes."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Find equipment</CardTitle>
            <CardDescription>
              Compare prices and availability from verified owners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/equipments" className={buttonVariants({ variant: "brand" })}>
              <Search />
              Browse catalog
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved items</CardTitle>
            <CardDescription>
              Come back to the equipment you marked as a favorite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/favorites"
              className={buttonVariants({ variant: "outline" })}
            >
              <Heart />
              View favorites
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
