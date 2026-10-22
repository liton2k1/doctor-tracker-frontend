"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useListParams } from "@/hooks/useListParams";
import { getErrorMessage } from "@/lib/errors";
import {
  useDeletePatientMutation,
  useGetPatientsQuery,
} from "@/services/patientsApi";
import type { Patient, PatientListParams } from "@/types";
import { ErrorState } from "@/components/common/ErrorState";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { Card, PageHeader } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";

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

export default function PatientsPage() {
  const { params, patch, toggleSort, reset, hasActiveFilters } =
    useListParams<PatientListParams>(INITIAL);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetPatientsQuery(params);
  const [deletePatient, { isLoading: deleting }] = useDeletePatientMutation();

  const [editing, setEditing] = useState<Patient | null>(null);
  const [toDelete, setToDelete] = useState<Patient | null>(null);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deletePatient(toDelete._id).unwrap();
      toast.success(`${toDelete.name} deleted`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Patients"
        description="Browse, edit and manage every patient across all doctors."
      />

      <Card className="overflow-hidden">
        <PatientFilters
          params={params}
          onChange={patch}
          onReset={reset}
          hasActiveFilters={hasActiveFilters}
        />

        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div
            className={
              isFetching && !isLoading
                ? "opacity-60 transition-opacity"
                : "transition-opacity"
            }
            aria-busy={isFetching}
          >
            <PatientsTable
              patients={data?.items ?? []}
              loading={isLoading}
              sortBy={params.sortBy}
              sortOrder={params.sortOrder}
              onSort={toggleSort}
              onEdit={setEditing}
              onDelete={setToDelete}
            />
          </div>
        )}

        {data && (
          <Pagination
            meta={data.meta}
            onPageChange={(page) => patch({ page })}
            onLimitChange={(limit) => patch({ limit })}
          />
        )}
      </Card>

      <PatientFormModal
        open={Boolean(editing)}
        patient={editing}
        onClose={() => setEditing(null)}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete patient"
        message={`Permanently delete ${toDelete?.name}? This action cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
