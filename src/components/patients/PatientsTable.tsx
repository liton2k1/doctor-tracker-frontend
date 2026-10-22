"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Edit,
  Pencil,
  Phone,
  Trash,
  Trash2,
  UserMinus,
  Users,
} from "lucide-react";
import { capitalize, formatDate, getInitials } from "@/lib/utils";
import type { Patient } from "@/types";
import { PlainHeader, SortHeader } from "@/components/common/SortHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

interface PatientsTableProps {
  patients: Patient[];
  loading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  withinDoctor?: boolean;
  emptyAction?: ReactNode;
}

const genderTone = { MALE: "blue", FEMALE: "violet", OTHER: "amber" } as const;

export function PatientsTable({
  patients,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  withinDoctor,
  emptyAction,
}: PatientsTableProps) {
  const removeLabel = withinDoctor ? "Remove" : "Delete";
  const RemoveIcon = withinDoctor ? UserMinus : Trash2;

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No patients found"
        description="Try adjusting your search or filters."
        action={emptyAction}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/60">
            <tr>
              <SortHeader
                label="Patient"
                field="name"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                label="Age"
                field="age"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <PlainHeader>Condition</PlainHeader>
              {!withinDoctor && <PlainHeader>Doctor</PlainHeader>}
              <PlainHeader>Phone</PlainHeader>
              <SortHeader
                label="Added"
                field="createdAt"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <PlainHeader className="text-right">Actions</PlainHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <tr
                key={patient._id}
                className="transition-colors hover:bg-slate-50/70"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={getInitials(patient.name)}
                      src={patient.profile}
                      alt={patient.name}
                    />
                    <span>
                      <span className="block font-medium text-slate-900">
                        {patient.name}
                      </span>
                      <Badge
                        tone={genderTone[patient.gender]}
                        className="mt-0.5"
                      >
                        {capitalize(patient.gender)}
                      </Badge>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  {patient.age}
                </td>
                <td className="px-4 py-3">
                  <Badge tone="rose">{patient.condition}</Badge>
                </td>
                {!withinDoctor && (
                  <td className="px-4 py-3">
                    <Link
                      href={`/doctors/${patient.doctor._id}`}
                      className="text-slate-700 hover:text-brand-700 hover:underline"
                    >
                      {patient.doctor.name}
                    </Link>
                    <span className="block text-xs text-slate-500">
                      {patient.doctor.specialization}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-slate-600">{patient.phone}</td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(patient.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <IconButton
                      label={`Edit ${patient.name}`}
                      onClick={() => onEdit(patient)}
                    >
                      <Edit className="h-4 w-4 text-brand-600" />
                    </IconButton>
                    <IconButton
                      label={`${removeLabel} ${patient.name}`}
                      onClick={() => onDelete(patient)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {patients.map((patient) => (
          <li key={patient._id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  initials={getInitials(patient.name)}
                  src={patient.profile}
                  alt={patient.name}
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-900">
                    {patient.name}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {patient.age} yrs · {capitalize(patient.gender)}
                  </span>
                </span>
              </div>
              <div className="flex shrink-0">
                <IconButton
                  label={`Edit ${patient.name}`}
                  onClick={() => onEdit(patient)}
                >
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label={`${removeLabel} ${patient.name}`}
                  onClick={() => onDelete(patient)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <RemoveIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
              <Badge tone="rose">{patient.condition}</Badge>
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" /> {patient.phone}
              </span>
              {!withinDoctor && (
                <Link
                  href={`/doctors/${patient.doctor._id}`}
                  className="font-medium text-brand-700"
                >
                  {patient.doctor.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
