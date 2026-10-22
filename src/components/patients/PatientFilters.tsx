"use client";

import { FilterX } from "lucide-react";
import { useDoctorOptions } from "@/hooks/useDoctorOptions";
import { useGetPatientFilterOptionsQuery } from "@/services/patientsApi";
import type { Gender, PatientListParams } from "@/types";
import { DateRangeFilter } from "@/components/common/DateRangeFilter";
import { SearchInput } from "@/components/common/SearchInput";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";

interface PatientFiltersProps {
  params: PatientListParams;
  onChange: (changes: Partial<PatientListParams>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  hideDoctorFilter?: boolean;
}

export function PatientFilters({
  params,
  onChange,
  onReset,
  hasActiveFilters,
  hideDoctorFilter,
}: PatientFiltersProps) {
  const { data: options } = useGetPatientFilterOptionsQuery();
  const { doctors } = useDoctorOptions();

  return (
    <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 xl:grid-cols-6">
      <div className="sm:col-span-2 xl:col-span-2">
        <SearchInput
          value={params.search}
          onChange={(search) => onChange({ search })}
          placeholder="Search name, phone, condition…"
        />
      </div>
      <Select
        aria-label="Filter by condition"
        value={params.condition}
        onChange={(e) => onChange({ condition: e.target.value })}
      >
        <option value="">All conditions</option>
        {options?.conditions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Filter by gender"
        value={params.gender}
        onChange={(e) => onChange({ gender: e.target.value as Gender | "" })}
      >
        <option value="">Any gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </Select>
      {!hideDoctorFilter && (
        <Select
          aria-label="Filter by doctor"
          value={params.doctorId}
          onChange={(e) => onChange({ doctorId: e.target.value })}
        >
          <option value="">All doctors</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </option>
          ))}
        </Select>
      )}
      <div className="sm:col-span-2 xl:col-span-2">
        <DateRangeFilter
          from={params.from}
          to={params.to}
          onChange={onChange}
        />
      </div>
      <Button
        variant="ghost"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="justify-self-start"
      >
        <FilterX className="h-4 w-4" />
        Clear
      </Button>
    </div>
  );
}
