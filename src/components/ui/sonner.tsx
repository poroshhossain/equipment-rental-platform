"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-xl border border-border bg-card text-card-foreground shadow-lg",
          description: "text-muted-foreground",
          actionButton: "bg-brand text-white",
          cancelButton: "bg-secondary text-secondary-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
