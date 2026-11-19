"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, Loader2, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  DASHBOARD_PROFILE_HREF,
  dashboardRoleMeta,
  getDashboardNav,
  isDashboardNavItemActive,
  normalizeDashboardRole,
} from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

const getInitials = (name?: string | null) => {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const role = normalizeDashboardRole(session?.user?.role);
  const roleMeta = dashboardRoleMeta[role];
  const navGroups = useMemo(() => getDashboardNav(role), [role]);

  const user = session?.user;
  const displayName = user?.name ?? "Guest";
  const email = user?.email ?? "Not signed in";
  const profileHref = DASHBOARD_PROFILE_HREF;

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-3 border-b border-sidebar-border/70 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="EquipRent"
              render={<Link href="/" />}
              className="h-11 gap-2.5 rounded-xl hover:bg-sidebar-accent/70"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground shadow-sm">
                <Boxes className="size-4" />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-heading text-sm font-bold">
                  Equip<span className="text-brand">Rent</span>
                </span>
                <span className="truncate text-[11px] font-normal text-sidebar-foreground/60">
                  {roleMeta.tagline}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 px-2.5 py-1.5 text-xs group-data-[collapsible=icon]:hidden">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          <span className="truncate font-medium text-sidebar-foreground/80">
            {roleMeta.label} workspace
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1 py-2">
        {isPending
          ? Array.from({ length: 2 }).map((_, index) => (
              <SidebarGroup key={index} className="py-1">
                <div className="mb-2 h-3 w-20 animate-pulse rounded bg-sidebar-accent" />
                <div className="space-y-1.5">
                  <div className="h-9 animate-pulse rounded-lg bg-sidebar-accent/70" />
                  <div className="h-9 animate-pulse rounded-lg bg-sidebar-accent/70" />
                  <div className="h-9 animate-pulse rounded-lg bg-sidebar-accent/70" />
                </div>
              </SidebarGroup>
            ))
          : navGroups.map((group) => (
              <SidebarGroup key={group.label} className="py-1">
                <SidebarGroupLabel className="px-2.5 text-[11px] font-semibold tracking-wider uppercase">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {group.items.map((item) => {
                      const isActive = isDashboardNavItemActive(pathname, item);

                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            size="lg"
                            isActive={isActive}
                            tooltip={item.title}
                            render={<Link href={item.href} />}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "relative h-9 gap-2.5 rounded-lg px-2.5 font-normal text-sidebar-foreground/75 transition-colors",
                              "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                              "data-active:bg-brand/10 data-active:font-semibold data-active:text-brand",
                              "data-active:before:absolute data-active:before:inset-y-2 data-active:before:left-0 data-active:before:w-[3px] data-active:before:rounded-full data-active:before:bg-brand",
                            )}
                          >
                            <item.icon className="size-4 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </SidebarMenuButton>
                          {item.badge ? (
                            <SidebarMenuBadge className="top-2 h-4 min-w-4 rounded-full bg-brand/10 px-1.5 text-[10px] font-semibold text-brand">
                              {item.badge}
                            </SidebarMenuBadge>
                          ) : null}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="pt-2">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={displayName}
              render={<Link href={profileHref} />}
              className="h-12 gap-2.5 rounded-xl hover:bg-sidebar-accent"
            >
              <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-brand/10 text-xs font-bold text-brand ring-1 ring-brand/15">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  getInitials(displayName)
                )}
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold">
                  {displayName}
                </span>
                <span className="truncate text-[11px] font-normal text-sidebar-foreground/60">
                  {email}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign out"
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="h-9 gap-2.5 rounded-lg px-2.5 font-normal text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
            >
              {isSigningOut ? (
                <Loader2 className="size-4 shrink-0 animate-spin" />
              ) : (
                <LogOut className="size-4 shrink-0" />
              )}
              <span className="truncate">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
