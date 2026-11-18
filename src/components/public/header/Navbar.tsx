"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/", label: "Equipment" },
  { href: "/", label: "Support" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground">
          <Boxes className="size-5" />
        </span>
        <span className="font-heading text-lg font-bold">
          Equip<span className="text-brand">Rent</span>
        </span>
      </Link>

      <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Link
          href="/login"
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/login"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className={cn(
            "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90",
            pathname === "/register" &&
              "ring-2 ring-brand/40 ring-offset-2 ring-offset-background",
          )}
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
