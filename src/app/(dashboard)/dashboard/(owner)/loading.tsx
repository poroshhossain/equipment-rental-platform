export default function OwnerLoading() {
  return (
    <div
      className="space-y-5"
      aria-busy="true"
      aria-label="Loading owner dashboard"
    >
      <div className="space-y-2">
        <div className="h-3 w-28 animate-pulse rounded bg-secondary" />
        <div className="h-7 w-56 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-secondary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>

      <div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
    </div>
  );
}
