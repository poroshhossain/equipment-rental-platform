"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import LoginWithGoogleBtn from "@/components/auth/LoginWithGoogleBtn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validations/auth";

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const clearFieldError = (field: keyof FieldErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0];
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus();
      }
      return;
    }

    setErrors({});
    setBusy(true);

    try {
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (result.error) {
        const message = result.error.message ?? "Incorrect email or password.";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back!");
      const session = await authClient.getSession();
      const role =
        (session.data?.user as { role?: string } | undefined)?.role ?? "customer";

      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const destination =
        requestedNext &&
        requestedNext.startsWith("/") &&
        !requestedNext.startsWith("//")
          ? requestedNext
          : `/dashboard/${role}`;
      router.push(destination);
      router.refresh();
    } catch {
      const message = "Could not sign in. Please check your connection and try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="rounded-2xl border-border/80 py-7 shadow-xl shadow-brand/5 sm:py-8">
      <CardHeader className="gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
          <LogIn className="size-5" />
        </span>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage your bookings, rentals and equipment.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
              className="h-11 px-3.5"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            <FieldError id="email-error" message={errors.email} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/#contact"
                className="text-xs font-medium text-brand underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-11 px-3.5 pr-11"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearFieldError("password");
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError id="password-error" message={errors.password} />
          </div>

          {formError ? (
            <div
              role="alert"
              className="flex gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p className="leading-relaxed">{formError}</p>
            </div>
          ) : null}

          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="h-11 w-full text-sm font-semibold"
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? <Loader2 className="animate-spin" /> : <LogIn className="size-4" />}
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="relative my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            or continue with
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <LoginWithGoogleBtn />

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
