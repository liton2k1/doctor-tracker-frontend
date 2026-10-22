"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageMeta } from "@/types";
import { Select } from "./Field";

interface PaginationProps {
  meta: PageMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const PAGE_SIZES = [10, 20, 50];

const buildPages = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("…");
    result.push(page);
  });
  return result;
};

export function Pagination({
  meta,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { page, limit, total, totalPages } = meta;
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const navButton =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600 sm:flex-row"
    >
      <div className="flex items-center gap-3">
        <p>
          Showing <span className="font-medium text-slate-900">{start}</span>–
          <span className="font-medium text-slate-900">{end}</span> of{" "}
          <span className="font-medium text-slate-900">{total}</span>
        </p>
        <Select
          aria-label="Rows per page"
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          className="h-8 w-[84px] py-0 text-xs"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={cn(navButton, "hover:bg-slate-100")}
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.hasPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {buildPages(page, totalPages).map((item, index) =>
          item === "…" ? (
            <span key={`gap-${index}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                navButton,
                item === page
                  ? "bg-brand-600 text-white"
                  : "hover:bg-slate-100",
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          className={cn(navButton, "hover:bg-slate-100")}
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.hasNext}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
