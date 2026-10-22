import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortHeaderProps {
  label: string;
  field: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}

export function SortHeader({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
  className,
}: SortHeaderProps) {
  const active = sortBy === field;
  const Icon = !active
    ? ChevronsUpDown
    : sortOrder === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <th
      scope="col"
      aria-sort={
        active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 uppercase hover:text-slate-900"
      >
        {label}
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            active ? "text-brand-600" : "text-slate-300",
          )}
        />
      </button>
    </th>
  );
}

export function PlainHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      )}
    >
      {children}
    </th>
  );
}
