import type { StatusTone } from "@/lib/types";
import { cn } from "@/lib/utils";

const badgeClasses: Record<StatusTone, string> = {
  success:
    "bg-success/10 text-emerald-700 ring-success/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  danger:
    "bg-destructive/10 text-destructive ring-destructive/20 dark:text-red-400",
  info: "bg-brand/10 text-brand ring-brand/20",
  neutral: "bg-muted text-muted-foreground ring-border",
};

const dotClasses: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-amber-500",
  danger: "bg-destructive",
  info: "bg-brand",
  neutral: "bg-muted-foreground/60",
};

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
  className?: string;
}

export default function StatusBadge({
  label,
  tone,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        badgeClasses[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClasses[tone])} />
      {label}
    </span>
  );
}
