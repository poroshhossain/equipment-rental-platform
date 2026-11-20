import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function getPageNumbers(
  page: number,
  pageCount: number,
): (number | "ellipsis")[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pageCount - 1, page + 1);

  if (from > 2) pages.push("ellipsis");
  for (let current = from; current <= to; current += 1) pages.push(current);
  if (to < pageCount - 1) pages.push("ellipsis");
  pages.push(pageCount);

  return pages;
}

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li className={cn("shrink-0", className)} {...props} />;
}

interface PaginationControlProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
  "aria-label"?: string;
  className?: string;
  children?: React.ReactNode;
  buttonSize?: "icon" | "default";
}

function PaginationLink({
  href,
  onClick,
  disabled,
  isActive,
  className,
  children,
  buttonSize = "icon",
  ...props
}: PaginationControlProps) {
  const classes = cn(
    buttonVariants({ variant: isActive ? "outline" : "ghost", size: buttonSize }),
    isActive && "border-brand bg-brand/10 text-brand hover:bg-brand/10 hover:text-brand",
    className,
  );

  const content = children;

  if (!disabled && href) {
    return (
      <Link href={href} className={classes} aria-current={isActive ? "page" : undefined} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {content}
    </button>
  );
}

function PaginationPrevious({
  href,
  onClick,
  disabled,
  className,
  label = "Previous",
}: Omit<PaginationControlProps, "children" | "isActive"> & { label?: string }) {
  return (
    <PaginationLink
      href={href}
      onClick={onClick}
      disabled={disabled}
      buttonSize="default"
      aria-label={label}
      className={cn("h-8 gap-1 px-2 sm:h-9 sm:px-2.5", className)}
    >
      <ChevronLeft className="size-4" />
      <span className="hidden lg:inline">{label}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  href,
  onClick,
  disabled,
  className,
  label = "Next",
}: Omit<PaginationControlProps, "children" | "isActive"> & { label?: string }) {
  return (
    <PaginationLink
      href={href}
      onClick={onClick}
      disabled={disabled}
      buttonSize="default"
      aria-label={label}
      className={cn("h-8 gap-1 px-2 sm:h-9 sm:px-2.5", className)}
    >
      <span className="hidden lg:inline">{label}</span>
      <ChevronRight className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex size-8 items-center justify-center sm:size-9", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

/** Compact on phones, full numbered list from `sm` upwards. */
export function ResponsivePagination({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const numberSize = "size-8 sm:size-9";
  const arrowSize = "px-2 sm:px-2.5";

  return (
    <Pagination className={cn("w-full sm:w-auto sm:mx-0", className)}>
      <PaginationContent className="max-w-full flex-wrap justify-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            className={arrowSize}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          />
        </PaginationItem>

        {/* Phones: just the current page out of the total. */}
        <PaginationItem className="sm:hidden">
          <PaginationLink
            className={numberSize}
            isActive
            aria-label={`Page ${page} of ${pageCount}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className="sm:hidden">
          <span className="flex h-8 items-center px-0.5 text-xs text-muted-foreground sm:h-9">
            / {pageCount}
          </span>
        </PaginationItem>

        {/* Small tablets and up: the full numbered list. */}
        {getPageNumbers(page, pageCount).map((value, index) =>
          value === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`} className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={value} className="hidden sm:block">
              <PaginationLink
                className={numberSize}
                isActive={value === page}
                aria-label={`Go to page ${value}`}
                onClick={() => onPageChange(value)}
              >
                {value}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            className={arrowSize}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
