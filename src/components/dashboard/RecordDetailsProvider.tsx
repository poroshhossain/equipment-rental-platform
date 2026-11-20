"use client";

import { createContext, useContext, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DetailsTarget {
  record: object;
  title: string;
}

interface RecordDetailsContextValue {
  showDetails: (target: DetailsTarget) => void;
}

const RecordDetailsContext = createContext<RecordDetailsContextValue | null>(null);

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

/** Hosts one stable details sheet so it survives dropdown-menu unmounting. */
export function RecordDetailsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [target, setTarget] = useState<DetailsTarget | null>(null);
  const entries = target ? Object.entries(target.record as Record<string, unknown>) : [];

  return (
    <RecordDetailsContext.Provider value={{ showDetails: setTarget }}>
      {children}
      <Sheet
        open={Boolean(target)}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
      >
        <SheetContent className="w-full data-[side=right]:sm:max-w-lg">
          <SheetHeader className="border-b border-border/70 pb-4">
            <SheetTitle className="text-lg">{target?.title ?? "Record details"}</SheetTitle>
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
    </RecordDetailsContext.Provider>
  );
}

export function useRecordDetails() {
  const context = useContext(RecordDetailsContext);
  if (!context) {
    throw new Error("useRecordDetails must be used inside RecordDetailsProvider");
  }
  return context;
}
