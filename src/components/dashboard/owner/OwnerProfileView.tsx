"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveOwnerProfile } from "@/lib/api/ownerAction";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";
import {
  type Equipment,
  type EquipmentRental,
  type OwnerProfile,
  type OwnerProfileInput,
} from "@/lib/types";

interface OwnerProfileViewProps {
  equipment: Equipment[];
  profile: OwnerProfile | null;
  rentals: EquipmentRental[];
}

export default function OwnerProfileView({
  equipment,
  profile: owner,
  rentals,
}: OwnerProfileViewProps) {
  const [profile, setProfile] = useState<OwnerProfileInput>({
    name: owner?.name ?? "",
    email: owner?.email ?? "",
    phone: owner?.phone ?? "",
    company: owner?.company ?? "",
    location: owner?.location ?? "",
    bio: owner?.bio ?? "",
    licenseNumber: owner?.licenseNumber ?? "",
  });

  const activeRentals = rentals.filter(
    (rental) => rental.bookingStatus === "active",
  ).length;
  const categoryCount = new Set(equipment.map((item) => item.category)).size;
  const paidRevenue = rentals
    .filter((rental) => rental.paymentStatus === "paid")
    .reduce((total, rental) => total + rental.bookingAmount, 0);

  const updateField = (field: keyof OwnerProfileInput, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    try {
      await saveOwnerProfile(profile);
      toast.success("Profile updated", {
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save profile.",
      );
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Account"
        title="My profile"
        description="Manage your personal details and the information renters see when they book."
        actions={
          <Button variant="brand" size="lg" onClick={handleSave}>
            <ShieldCheck />
            Save changes
          </Button>
        }
      />

      <Card className="gap-0 overflow-hidden p-0">
        <div className="h-28 bg-gradient-to-r from-brand/25 via-brand/10 to-transparent" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex items-end gap-4">
            <div className="relative">
              {owner?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={owner.avatar}
                  alt={owner.name}
                  className="size-20 rounded-2xl border-4 border-card bg-secondary object-cover"
                />
              ) : (
                <span className="grid size-20 place-items-center rounded-2xl border-4 border-card bg-brand/10 font-heading text-xl font-bold text-brand">
                  {getInitials(owner?.name ?? "Owner")}
                </span>
              )}
              {owner?.verified ? (
                <span className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full border-2 border-card bg-success text-white">
                  <BadgeCheck className="size-3.5" />
                </span>
              ) : null}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-bold">
                  {profile.name}
                </h2>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                  Owner
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{profile.company}</p>
              <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3.5" />
                  {owner?.joinedAt
                    ? `Joined ${formatDate(owner.joinedAt)}`
                    : "New member"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Listed equipment"
          value={equipment.length}
          hint={`Across ${categoryCount} categories`}
          icon={Building2}
        />
        <StatCard
          label="Active rentals"
          value={activeRentals}
          hint="Currently with customers"
          icon={UserRound}
          tone="success"
        />
        <StatCard
          label="Lifetime revenue"
          value={formatCurrency(paidRevenue)}
          hint="From paid bookings"
          icon={ShieldCheck}
          tone="warning"
        />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="gap-0 overflow-hidden">
          <CardHeader className="gap-1 border-b border-border/70 pb-5">
            <CardTitle className="text-base">Personal information</CardTitle>
            <CardDescription>
              Keep your contact details up to date so renters can reach you.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={profile.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="h-9 pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-phone"
                  value={profile.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="h-9 pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-location">Location</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-location"
                  value={profile.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  className="h-9 pl-9"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-bio">About you</Label>
              <Textarea
                id="profile-bio"
                value={profile.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                className="min-h-24"
                placeholder="Tell renters about your experience and equipment."
              />
              <p className="text-xs text-muted-foreground">
                This appears on your public owner profile.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-base">Business details</CardTitle>
              <CardDescription>Used for verification and payouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-company">Company</Label>
                <Input
                  id="profile-company"
                  value={profile.company}
                  onChange={(event) =>
                    updateField("company", event.target.value)
                  }
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-license">Business license</Label>
                <Input
                  id="profile-license"
                  value={profile.licenseNumber}
                  onChange={(event) =>
                    updateField("licenseNumber", event.target.value)
                  }
                  className="h-9"
                />
              </div>
              <div
                className={`flex items-center gap-2 rounded-lg p-2.5 text-xs ${
                  owner?.verified
                    ? "bg-success/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {owner?.verified ? (
                  <BadgeCheck className="size-4 shrink-0" />
                ) : (
                  <ShieldCheck className="size-4 shrink-0" />
                )}
                {owner?.verified
                  ? "Business verified by EquipRent"
                  : "Business verification pending"}
              </div>
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-base">Account status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">Owner</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="flex items-center gap-1 font-medium text-success">
                  <BadgeCheck className="size-3.5" />
                  {owner?.email ? "On file" : "Not provided"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Verification</span>
                <span className="font-medium">
                  {owner?.verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {owner?.joinedAt ? formatDate(owner.joinedAt) : "—"}
                </span>
              </div>
              <p className="border-t border-border/70 pt-3 text-xs text-muted-foreground">
                Contact support to change your account email or identity details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
