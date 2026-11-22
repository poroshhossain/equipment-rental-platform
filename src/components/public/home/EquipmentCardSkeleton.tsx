import { Skeleton } from "@/components/ui/skeleton";

export function EquipmentCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      aria-busy="true"
      aria-label="Loading equipment"
    >
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-end justify-between gap-2 border-t border-border/70 pt-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default EquipmentCardSkeleton;
