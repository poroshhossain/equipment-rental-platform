import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatTone = "brand" | "success" | "warning" | "danger";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: StatTone;
  trend?: string;
  className?: string;
}

const toneClasses: Record<StatTone, string> = {
  brand: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
};

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "brand",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-bold tracking-tight">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {trend ? (
          <span className="rounded-full bg-success/10 px-2 py-0.5 font-semibold text-success">
            {trend}
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}
