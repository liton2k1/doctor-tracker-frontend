"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Edit,
  Mail,
  Pencil,
  Phone,
  Plus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useListParams } from "@/hooks/useListParams";
import { getErrorMessage } from "@/lib/errors";
import { formatDate, getInitials } from "@/lib/utils";
import {
  useGetDoctorPatientsQuery,
  useGetDoctorQuery,
  useRemovePatientFromDoctorMutation,
} from "@/services/doctorsApi";
import type { Patient, PatientListParams } from "@/types";
import { ErrorState } from "@/components/common/ErrorState";
import { DoctorFormModal } from "@/components/doctors/DoctorFormModal";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";

const INITIAL: PatientListParams = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  from: "",
  to: "",
  condition: "",
  gender: "",
  doctorId: "",
};

function InfoItem({
  icon: Icon,
  children,
}: {
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      <span className="min-w-0 truncate">{children}</span>
    </li>
  );
}

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const doctorQuery = useGetDoctorQuery(id);
  const { params, patch, toggleSort, reset, hasActiveFilters } =
    useListParams<PatientListParams>(INITIAL);
  const { doctorId: _unused, ...patientParams } = params;
  const patientsQuery = useGetDoctorPatientsQuery({ id, ...patientParams });
  const [removePatient, { isLoading: removing }] =
    useRemovePatientFromDoctorMutation();

  const [editDoctorOpen, setEditDoctorOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [toRemove, setToRemove] = useState<Patient | null>(null);

  const confirmRemove = async () => {
    if (!toRemove) return;
    try {
      await removePatient({ doctorId: id, patientId: toRemove._id }).unwrap();
      toast.success(`${toRemove.name} removed`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setToRemove(null);
    }
  };

  if (doctorQuery.isError) {
    const status = (doctorQuery.error as { status?: number })?.status;
    const notFound = status === 404 || status === 400;
    return (
      <Card>
        <ErrorState
          message={
            notFound
              ? "This doctor does not exist."
              : "We could not load this doctor."
          }
          onRetry={notFound ? undefined : doctorQuery.refetch}
        />
        <div className="pb-8 text-center">
          <Link
            href="/doctors"
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            Back to doctors
          </Link>
        </div>
      </Card>
    );
  }

  const doctor = doctorQuery.data;
  const patientsData = patientsQuery.data;

  const addButton = (
    <Button onClick={() => setAddOpen(true)}>
      <Plus className="h-4 w-4" />
      Add patient
    </Button>
  );

  return (
    <>
      <Link
        href="/doctors"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All doctors
      </Link>

      <Card className="p-5 sm:p-6">
        {!doctor ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar
                initials={getInitials(doctor.name)}
                src={doctor.profile}
                alt={doctor.name}
                className="h-14 w-14 text-base"
              />
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  {doctor.name}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge tone="brand">{doctor.specialization}</Badge>
                  <Badge tone="slate">{doctor.patientCount} patients</Badge>
                </div>
                <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  <InfoItem icon={Building2}>{doctor.hospital}</InfoItem>
                  <InfoItem icon={Phone}>{doctor.phone}</InfoItem>
                  <InfoItem icon={Mail}>{doctor.email}</InfoItem>
                  <InfoItem icon={CalendarDays}>
                    Joined {formatDate(doctor.createdAt)}
                  </InfoItem>
                </ul>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setEditDoctorOpen(true)}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        )}
      </Card>

      <div className="mb-4 mt-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">Patients</h2>
        </div>
        {addButton}
      </div>

      <Card className="overflow-hidden">
        <PatientFilters
          params={params}
          onChange={patch}
          onReset={reset}
          hasActiveFilters={hasActiveFilters}
          hideDoctorFilter
        />

        {patientsQuery.isError ? (
          <ErrorState onRetry={patientsQuery.refetch} />
        ) : (
          <div
            className={
              patientsQuery.isFetching && !patientsQuery.isLoading
                ? "opacity-60 transition-opacity"
                : "transition-opacity"
            }
            aria-busy={patientsQuery.isFetching}
          >
            <PatientsTable
              withinDoctor
              patients={patientsData?.items ?? []}
              loading={patientsQuery.isLoading}
              sortBy={params.sortBy}
              sortOrder={params.sortOrder}
              onSort={toggleSort}
              onEdit={setEditingPatient}
              onDelete={setToRemove}
              emptyAction={addButton}
            />
          </div>
        )}

        {patientsData && (
          <Pagination
            meta={patientsData.meta}
            onPageChange={(page) => patch({ page })}
            onLimitChange={(limit) => patch({ limit })}
          />
        )}
      </Card>

      <DoctorFormModal
        open={editDoctorOpen}
        doctor={doctor ?? null}
        onClose={() => setEditDoctorOpen(false)}
      />
      <PatientFormModal
        open={addOpen}
        doctorId={id}
        onClose={() => setAddOpen(false)}
      />
      <PatientFormModal
        open={Boolean(editingPatient)}
        patient={editingPatient}
        onClose={() => setEditingPatient(null)}
      />

      <ConfirmDialog
        open={Boolean(toRemove)}
        title="Remove patient"
        message={`Remove ${toRemove?.name} from this doctor's patient list? The patient record will be permanently deleted.`}
        confirmLabel="Remove"
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setToRemove(null)}
      />
    </>
  );
}
