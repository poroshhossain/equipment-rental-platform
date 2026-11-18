import type { Metadata } from "next";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | EquipRent",
  description: "Sign in to your EquipRent account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
