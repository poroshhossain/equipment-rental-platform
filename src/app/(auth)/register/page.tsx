import type { Metadata } from "next";

import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account | EquipRent",
  description:
    "Create your EquipRent account to book professional equipment in minutes.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
