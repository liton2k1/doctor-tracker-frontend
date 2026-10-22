"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useListParams } from "@/hooks/useListParams";
import { getErrorMessage } from "@/lib/errors";
import {
  useDeleteDoctorMutation,
  useGetDoctorsQuery,
} from "@/services/doctorsApi";
import type { Doctor, DoctorListParams } from "@/types";
import { ErrorState } from "@/components/common/ErrorState";
import { DoctorFilters } from "@/components/doctors/DoctorFilters";
import { DoctorFormModal } from "@/components/doctors/DoctorFormModal";
import { DoctorsTable } from "@/components/doctors/DoctorsTable";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";

const INITIAL: DoctorListParams = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  from: "",
  to: "",
  specialization: "",
  hospital: "",
};

export default function DoctorsPage() {
  const { params, patch, toggleSort, reset, hasActiveFilters } =
    useListParams<DoctorListParams>(INITIAL);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDoctorsQuery(params);
  const [deleteDoctor, { isLoading: deleting }] = useDeleteDoctorMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [toDelete, setToDelete] = useState<Doctor | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (doctor: Doctor) => {
    setEditing(doctor);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteDoctor(toDelete._id).unwrap();
      toast.success(`${toDelete.name} deleted`);
      setToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setToDelete(null);
    }
  };

  const addButton = (
    <Button onClick={openCreate}>
      <Plus className="h-4 w-4" />
      Add doctor
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Manage doctors and open a profile to see their patients."
        actions={addButton}
      />

      <Card className="overflow-hidden">
        <DoctorFilters
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
            <DoctorsTable
              doctors={data?.items ?? []}
              loading={isLoading}
              sortBy={params.sortBy}
              sortOrder={params.sortOrder}
              onSort={toggleSort}
              onEdit={openEdit}
              onDelete={setToDelete}
              emptyAction={addButton}
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

      <DoctorFormModal
        open={formOpen}
        doctor={editing}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete doctor"
        message={`Are you sure you want to delete ${toDelete?.name}? Doctors who still have patients cannot be deleted.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
