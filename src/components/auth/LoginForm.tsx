"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validations/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details.");
      return;
    }

    setBusy(true);
    try {
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Could not sign in.");
        return;
      }

      toast.success("Welcome back!");
      const session = await authClient.getSession();
      const role = (session.data?.user as { role?: string } | undefined)?.role ?? "customer";
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next || `/dashboard/${role}`);
      router.refresh();
    } catch {
      toast.error("Could not sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
          <LogIn className="size-5" />
        </span>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage your bookings and rentals.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="pr-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : null}
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to EquipRent?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
