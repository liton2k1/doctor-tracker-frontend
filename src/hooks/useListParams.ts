import { useCallback, useMemo, useRef, useState } from "react";
import type { ListParams } from "@/types";

const NON_FILTER_KEYS = ["page", "limit", "sortBy", "sortOrder"];

/** Local state for paginated/filterable lists. Changing any filter resets to page 1. */
export function useListParams<T extends ListParams>(initial: T) {
  const initialRef = useRef(initial);
  const [params, setParams] = useState<T>(initial);

  const patch = useCallback((changes: Partial<T>) => {
    setParams((prev) => ({ ...prev, ...changes, page: changes.page ?? 1 }));
  }, []);

  const toggleSort = useCallback((field: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  }, []);

  const reset = useCallback(() => setParams({ ...initialRef.current }), []);

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(params).some(
        ([key, value]) => !NON_FILTER_KEYS.includes(key) && value !== "",
      ),
    [params],
  );

  return { params, patch, toggleSort, reset, hasActiveFilters };
}
