"use client";

import { FilterX } from "lucide-react";
import { useGetDoctorFilterOptionsQuery } from "@/services/doctorsApi";
import type { DoctorListParams } from "@/types";
import { SearchInput } from "@/components/common/SearchInput";
import { DateRangeFilter } from "@/components/common/DateRangeFilter";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";

interface DoctorFiltersProps {
  params: DoctorListParams;
  onChange: (changes: Partial<DoctorListParams>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function DoctorFilters({
  params,
  onChange,
  onReset,
  hasActiveFilters,
}: DoctorFiltersProps) {
  const { data: options } = useGetDoctorFilterOptionsQuery();

  return (
    <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.6fr_auto]">
      <SearchInput
        value={params.search}
        onChange={(search) => onChange({ search })}
        placeholder="Search name, email, phone, hospital…"
      />
      <Select
        aria-label="Filter by specialization"
        value={params.specialization}
        onChange={(e) => onChange({ specialization: e.target.value })}
      >
        <option value="">All specializations</option>
        {options?.specializations.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Filter by hospital"
        value={params.hospital}
        onChange={(e) => onChange({ hospital: e.target.value })}
      >
        <option value="">All hospitals</option>
        {options?.hospitals.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <DateRangeFilter from={params.from} to={params.to} onChange={onChange} />
      <Button
        variant="ghost"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="justify-self-start xl:justify-self-auto"
      >
        <FilterX className="h-4 w-4" />
        Clear
      </Button>
    </div>
  );
}
