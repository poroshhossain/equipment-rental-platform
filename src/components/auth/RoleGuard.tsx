"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import type { UserRole } from "@/lib/types";

/** Keeps role-specific pages away from users with another role. */
export default function RoleGuard({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const currentRole = session?.user?.role;

  useEffect(() => {
    if (isPending || !session?.user || currentRole === role) return;
    router.push(`/dashboard/${currentRole ?? "customer"}`);
  }, [isPending, session, currentRole, role, router]);

  if (isPending || currentRole !== role) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}
