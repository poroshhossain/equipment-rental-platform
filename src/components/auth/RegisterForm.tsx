"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

import PasswordRequirements from "@/components/auth/PasswordRequirements";
import PhotoField from "@/components/auth/PhotoField";
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
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import LoginWithGoogleBtn from "./LoginWithGoogleBtn";


export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      photoUrl: "",
      password: "",
    },
  });

  const photoUrl = useWatch({ control, name: "photoUrl" });
  const password = useWatch({ control, name: "password" });

  const handlePhotoChange = (value: string) => {
    setValue("photoUrl", value, { shouldValidate: Boolean(errors.photoUrl) });
  };

  const onSubmit = async (values: RegisterValues) => {
    try {
      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.photoUrl || undefined,
        callbackURL: "/",
      });

      if (error) {
        toast.error("Registration failed", {
          description:
            error.message ?? "Could not create your account. Please try again.",
        });
        return;
      }

      if (data?.user) {
        toast.success("Account created", {
          description: `Welcome to EquipRent, ${values.name.split(" ")[0]}!`,
        });
        router.push("/");
        reset();
      }

    } catch {
      toast.error("Something went wrong", {
        description: "Please check your connection and try again.",
      });
    }
  };

  const onInvalid = (formErrors: FieldErrors<RegisterValues>) => {
    if (formErrors.password?.message) {
      toast.error("Password doesn't meet the requirements", {
        description: formErrors.password.message,
      });
      return;
    }

    toast.error("Please fix the highlighted fields and try again.");
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
          <User className="size-5" />
        </span>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join EquipRent and book equipment in minutes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Jane Cooper"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            <FieldError id="name-error" message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            <FieldError id="email-error" message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
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
            <FieldError id="password-error" message={errors.password?.message} />
            {(password?.length > 0 || errors.password) && (
              <PasswordRequirements password={password ?? ""} />
            )}
          </div>

          <PhotoField
            value={photoUrl}
            error={errors.photoUrl?.message}
            onChange={handlePhotoChange}
          />

          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <LoginWithGoogleBtn />
        </p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
