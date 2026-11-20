"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md space-y-5 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </span>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            The page could not be loaded. Try again, or head back to the home page.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="brand" onClick={reset}>
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
