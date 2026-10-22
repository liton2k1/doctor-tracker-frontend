"use client";

import Link from "next/link";
import { Edit, Eye, Mail, Phone, Stethoscope, Trash2 } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import type { Doctor } from "@/types";
import { PlainHeader, SortHeader } from "@/components/common/SortHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ReactNode } from "react";

interface DoctorsTableProps {
  doctors: Doctor[];
  loading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
  emptyAction?: ReactNode;
}

export function DoctorsTable({
  doctors,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  emptyAction,
}: DoctorsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No doctors found"
        description="Try adjusting your search or filters, or add a new doctor."
        action={emptyAction}
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/60">
            <tr>
              <SortHeader
                label="Doctor"
                field="name"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <PlainHeader>Specialization</PlainHeader>
              <PlainHeader>Hospital</PlainHeader>
              <PlainHeader>Phone</PlainHeader>
              <SortHeader
                label="Patients"
                field="patientCount"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                label="Joined"
                field="createdAt"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <PlainHeader className="text-right">Actions</PlainHeader>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {doctors.map((doctor) => (
              <tr
                key={doctor._id}
                className="transition-colors hover:bg-slate-50/70"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="group flex items-center gap-3"
                  >
                    <Avatar
                      initials={getInitials(doctor.name)}
                      src={doctor.profile}
                      alt={doctor.name}
                    />
                    <span>
                      <span className="block font-medium text-slate-900 group-hover:text-brand-700">
                        {doctor.name}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {doctor.email}
                      </span>
                    </span>
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <Badge tone="brand">{doctor.specialization}</Badge>
                </td>

                <td className="px-4 py-3 text-slate-600">{doctor.hospital}</td>

                <td className="px-4 py-3 text-slate-600">{doctor.phone}</td>

                <td className="px-4 py-3 font-medium tabular-nums text-slate-900">
                  {doctor.patientCount}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {formatDate(doctor.createdAt)}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      aria-label={`View ${doctor.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <IconButton
                      label={`Edit ${doctor.name}`}
                      onClick={() => onEdit(doctor)}
                    >
                      <Edit className="h-4 w-4 text-brand-600" />
                    </IconButton>

                    <IconButton
                      label={`Delete ${doctor.name}`}
                      onClick={() => onDelete(doctor)}
                      className="text-red-600 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {doctors.map((doctor) => (
          <li key={doctor._id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/doctors/${doctor._id}`}
                className="flex min-w-0 items-center gap-3"
              >
                <Avatar
                  initials={getInitials(doctor.name)}
                  src={doctor.profile}
                  alt={doctor.name}
                />

                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-900">
                    {doctor.name}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {doctor.hospital}
                  </span>
                </span>
              </Link>

              <div className="flex shrink-0">
                <Link
                  href={`/doctors/${doctor._id}`}
                  aria-label={`View ${doctor.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <Eye className="h-4 w-4" />
                </Link>

                <IconButton
                  label={`Edit ${doctor.name}`}
                  onClick={() => onEdit(doctor)}
                >
                  <Edit className="h-4 w-4 text-brand-600" />
                </IconButton>

                <IconButton
                  label={`Delete ${doctor.name}`}
                  onClick={() => onDelete(doctor)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
              <Badge tone="brand">{doctor.specialization}</Badge>

              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {doctor.phone}
              </span>

              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {doctor.email}
              </span>

              <span className="font-medium text-slate-900">
                {doctor.patientCount} patients
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
