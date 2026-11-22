"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/theme-toggle";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipments", label: "All Equipment" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-choose-us", label: "Why choose us" },
  { href: "/#contact", label: "Contact Us" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } finally {
      setIsSigningOut(false);
      setOpen(false);
    }
  };

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        pathname === href
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );

  const authActions = (
    <div className="flex items-center gap-2">
      {isPending ? (
        <span className="flex size-9 items-center justify-center text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
        </span>
      ) : isLoggedIn ? (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setOpen(false);
              router.push(`/dashboard/${session?.user?.role}`);
            }}
            className="cursor-pointer bg-brand text-brand-foreground hover:bg-brand/50 hover:text-brand-foreground/80"
          >
            Dashboard
          </Button>
          <Button className="text-destructive/50 hover:bg-destructive/20 hover:text-destructive cursor-pointer" variant="ghost" size="sm" onClick={handleLogout} disabled={isSigningOut}>
            {isSigningOut && <Loader2 className="animate-spin" />}
            <LogOut />
            Logout
          </Button>
        </>
      ) : (
        <>
          {pathname !== "/login" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                router.push("/login");
              }}
            >
              Login
            </Button>
          )}
          {pathname !== "/register" && (
            <Button
              variant="brand"
              size="sm"
              onClick={() => {
                setOpen(false);
                router.push("/register");
              }}
            >
              Register
            </Button>
          )}
        </>
      )}
    </div>
  );

  return (
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Logo />

      <div className="hidden items-center gap-1 lg:flex">
        {links.map((link) => navLink(link.href, link.label))}
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <ThemeToggle />
        {authActions}
      </div>

      {/* Mobile menu trigger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-lg text-foreground transition-colors hover:bg-secondary lg:hidden"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => navLink(link.href, link.label))}
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <ThemeToggle />
              {authActions}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
