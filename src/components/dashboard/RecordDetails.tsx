"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function display(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(display).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${key}: ${display(item)}`)
      .join(" · ");
  }
  return String(value);
}

/** Shows every field stored on a record, including nested objects. */
export default function RecordDetails({
  record,
  title = "Record details",
}: {
  record: object;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const entries = Object.entries(record as Record<string, unknown>);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="View all fields"
        onClick={() => setOpen(true)}
      >
        <Eye />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full data-[side=right]:sm:max-w-lg">
          <SheetHeader className="border-b border-border/70 pb-4">
            <SheetTitle className="text-lg">{title}</SheetTitle>
            <SheetDescription>
              All {entries.length} fields stored for this record.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
            {entries.map(([key, value]) => (
              <div key={key} className="rounded-lg border border-border/70 p-2.5">
                <p className="text-[11px] text-muted-foreground">{key}</p>
                <p className="break-words text-sm">{display(value)}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
