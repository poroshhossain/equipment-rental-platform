"use client";

import { useState } from "react";

import { ResponsivePagination } from "@/components/ui/pagination";

export function usePagination<T>(items: T[], pageSize = 8, resetKey = "") {
  // Changing resetKey (e.g. a filter) sends the user back to page 1.
  const [requested, setRequested] = useState({ key: resetKey, page: 1 });
  const requestedPage = requested.key === resetKey ? requested.page : 1;
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return {
    page,
    pageCount,
    pageItems: items.slice(start, end),
    start,
    end,
    total,
    setPage: (next: number) => setRequested({ key: resetKey, page: next }),
  };
}

export function TablePagination({
  page,
  pageCount,
  start,
  end,
  total,
  onPageChange,
  label = "records",
}: {
  page: number;
  pageCount: number;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3 border-t border-border/70 px-3 py-3 text-center sm:flex-row sm:justify-between sm:px-4 sm:text-left">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start + 1}</span>–
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> {label}
      </p>
      {pageCount > 1 ? (
        <ResponsivePagination
          page={page}
          pageCount={pageCount}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
