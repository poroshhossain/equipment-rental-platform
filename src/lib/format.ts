const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function formatShortDate(value: string | Date): string {
  return shortDateFormatter.format(new Date(value));
}

export function formatDateRange(start: string, end: string): string {
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

export function getDurationInDays(start: string, end: string): number {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const dayInMs = 1000 * 60 * 60 * 24;

  return Math.max(1, Math.round((endTime - startTime) / dayInMs));
}

export function getInitials(name?: string | null): string {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
