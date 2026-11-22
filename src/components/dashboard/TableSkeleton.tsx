import { Skeleton } from "@/components/ui/skeleton";

const columnWidths = ["w-28", "w-20", "w-24", "w-16", "w-32", "w-20", "w-24"];

export function TableSkeleton({
  rows = 6,
  columns = 5,
  label = "Loading records",
}: {
  rows?: number;
  columns?: number;
  label?: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      aria-busy="true"
      aria-label={label}
    >
      <div className="flex items-center gap-4 border-b border-border/70 bg-secondary/40 px-4 py-3.5">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-20" />
        ))}
      </div>
      <div className="divide-y divide-border/70">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={`h-4 ${columnWidths[columnIndex % columnWidths.length]}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeleton;
