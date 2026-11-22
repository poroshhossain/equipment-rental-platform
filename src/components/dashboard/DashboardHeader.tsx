"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme/theme-toggle";
import { findDashboardNavItem, normalizeDashboardRole } from "@/lib/dashboard-nav";
import { authClient } from "@/lib/auth-client";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const currentItem = findDashboardNavItem(pathname);
  const role = normalizeDashboardRole(session?.user?.role);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:rounded-t-xl md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-5"
      />

      <div className="min-w-0 leading-tight">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Dashboard
        </p>
        <h1 className="truncate text-sm font-semibold">
          {currentItem?.title ?? "Overview"}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        {session?.user ? (
          <span className="hidden rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium capitalize text-muted-foreground sm:inline-flex">
            {role}
          </span>
        ) : null}
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          View site
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </header>
  );
}
