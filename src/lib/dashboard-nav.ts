import {
  CalendarCheck,
  Heart,
  LayoutDashboard,
  Package,
  PackagePlus,
  ClipboardList,
  UserRound,
  Users,
  Boxes,
  type LucideIcon,
} from "lucide-react";

/** Roles supported by the dashboard. Mirrors the `role` extra field in better-auth. */
export type DashboardRole = "customer" | "owner" | "admin";

export interface DashboardNavItem {
  /** Label shown in the sidebar and in the dashboard header. */
  title: string;
  href: string;
  icon: LucideIcon;
  /** Match the pathname exactly (useful for role overview pages). */
  exact?: boolean;
  /** Optional pill rendered on the right side of the item. */
  badge?: string;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export interface DashboardRoleMeta {
  label: string;
  /** Short line shown under the brand in the sidebar. */
  tagline: string;
}

export const dashboardRoleMeta: Record<DashboardRole, DashboardRoleMeta> = {
  customer: { label: "Customer", tagline: "Rent what you need" },
  owner: { label: "Owner", tagline: "Manage your fleet" },
  admin: { label: "Admin", tagline: "Platform control" },
};

/** Shared profile route for every role. */
export const DASHBOARD_PROFILE_HREF = "/dashboard/my-profile";

/**
 * Single source of truth for the dashboard navigation.
 * Add/remove items here — the sidebar and header update automatically.
 */
export const dashboardNavConfig: Record<DashboardRole, DashboardNavGroup[]> = {
  customer: [
    {
      label: "Workspace",
      items: [
        {
          title: "Overview",
          href: "/dashboard/customer",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: "My Rentals",
          href: "/dashboard/my-rentals",
          icon: CalendarCheck,
        },
        {
          title: "Favorites",
          href: "/dashboard/favorites",
          icon: Heart,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          title: "Profile",
          href: DASHBOARD_PROFILE_HREF,
          icon: UserRound,
        },
      ],
    },
  ],
  owner: [
    {
      label: "Workspace",
      items: [
        {
          title: "Overview",
          href: "/dashboard/owner",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: "Add Equipment",
          href: "/dashboard/add-equipment",
          icon: PackagePlus,
          badge: "New",
        },
        {
          title: "My Equipment",
          href: "/dashboard/my-equipment",
          icon: Package,
        },
        {
          title: "My Equipment Rental",
          href: "/dashboard/my-equipment-rentals",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          title: "Profile",
          href: DASHBOARD_PROFILE_HREF,
          icon: UserRound,
        },
      ],
    },
  ],
  admin: [
    {
      label: "Management",
      items: [
        {
          title: "Overview",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: "All Users",
          href: "/dashboard/all-users",
          icon: Users,
        },
        {
          title: "All Equipment",
          href: "/dashboard/all-equipment",
          icon: Boxes,
        },
        {
          title: "All Rentals",
          href: "/dashboard/all-rentals",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          title: "Profile",
          href: DASHBOARD_PROFILE_HREF,
          icon: UserRound,
        },
      ],
    },
  ],
};

export const DASHBOARD_ROLES = Object.keys(dashboardNavConfig) as DashboardRole[];

export function isDashboardRole(value: unknown): value is DashboardRole {
  return (
    typeof value === "string" &&
    (DASHBOARD_ROLES as string[]).includes(value)
  );
}

/** Falls back to the default better-auth role (`customer`). */
export function normalizeDashboardRole(value: unknown): DashboardRole {
  return isDashboardRole(value) ? value : "customer";
}

/**
 * Infers the dashboard role from the current route.
 * Used as a fallback before the session is available (or when previewing pages).
 */
export function getDashboardRoleFromPathname(
  pathname: string,
): DashboardRole | null {
  const matches = (routes: string[]) =>
    routes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

  if (
    matches([
      "/dashboard/owner",
      "/dashboard/add-equipment",
      "/dashboard/my-equipment",
      "/dashboard/my-equipment-rentals",
      "/dashboard/my-profile",
    ])
  ) {
    return "owner";
  }

  if (matches(["/dashboard/admin", "/dashboard/all-users", "/dashboard/all-equipment", "/dashboard/all-rentals"])) {
    return "admin";
  }

  if (
    matches([
      "/dashboard/customer",
      "/dashboard/my-rentals",
      "/dashboard/favorites",
    ])
  ) {
    return "customer";
  }

  return null;
}

export function getDashboardNav(role: unknown): DashboardNavGroup[] {
  return dashboardNavConfig[normalizeDashboardRole(role)];
}

export function isDashboardNavItemActive(
  pathname: string,
  item: Pick<DashboardNavItem, "href" | "exact">,
): boolean {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Finds the nav item that best matches the current pathname.
 * Used by the dashboard header to render the page title.
 */
export function findDashboardNavItem(
  pathname: string,
): DashboardNavItem | undefined {
  return DASHBOARD_ROLES.flatMap((role) => dashboardNavConfig[role])
    .flatMap((group) => group.items)
    .filter((item) => isDashboardNavItemActive(pathname, item))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
