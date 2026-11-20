"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

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
import { authClient } from "@/lib/auth-client";
import { getUserProfile, saveUserProfile } from "@/lib/api/ownerAction";
import { getInitials } from "@/lib/format";

const emptyForm = { name: "", email: "", image: "", phone: "", address: "" };

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id ?? "";
  const accountName = session?.user?.name ?? "";
  const accountEmail = session?.user?.email ?? "";
  const accountImage = session?.user?.image ?? "";

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    getUserProfile(userId)
      .then((profile) =>
        setForm(
          profile
            ? {
                name: profile.name,
                email: profile.email,
                image: profile.image,
                phone: profile.phone,
                address: profile.address,
              }
            : {
                name: accountName,
                email: accountEmail,
                image: accountImage,
                phone: "",
                address: "",
              },
        ),
      )
      .finally(() => setLoading(false));
  }, [userId, accountName, accountEmail, accountImage]);

  const update = (field: keyof typeof emptyForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setSaving(true);
    try {
      await saveUserProfile({ userId, ...form });
      toast.success("Profile updated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>
          Keep your contact details up to date. This profile is shared by all
          dashboard roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border border-border/70 p-4">
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt={form.name || "Profile"}
                className="size-16 rounded-full bg-secondary object-cover"
              />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-brand/10 font-heading text-lg font-bold text-brand">
                {getInitials(form.name || "User")}
              </span>
            )}
            <div className="space-y-2 flex-1">
              <Label htmlFor="profile-image">Profile image URL</Label>
              <Input
                id="profile-image"
                type="url"
                placeholder="https://…"
                value={form.image}
                onChange={(event) => update("image", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                required
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone number</Label>
              <Input
                id="profile-phone"
                type="tel"
                placeholder="+1 555 000 1234"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-address">Address</Label>
              <Textarea
                id="profile-address"
                rows={3}
                placeholder="Street, city, state, ZIP"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="brand" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
