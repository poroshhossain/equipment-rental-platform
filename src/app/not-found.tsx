import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md space-y-4 text-center">
        <p className="font-heading text-6xl font-bold text-brand">404</p>
        <h1 className="font-heading text-2xl font-bold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className={buttonVariants({ variant: "brand" })}>
          Back home
        </Link>
      </div>
    </div>
  );
}
