"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDoctorOptions } from "@/hooks/useDoctorOptions";
import { applyServerErrors, getErrorMessage } from "@/lib/errors";
import { buildFormData } from "@/lib/formData";
import { useAddPatientToDoctorMutation } from "@/services/doctorsApi";
import { useUpdatePatientMutation } from "@/services/patientsApi";
import type { Patient } from "@/types";
import {
  ProfileImageInput,
  type ProfileImageValue,
} from "@/components/common/ProfileImageInput";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(150, "Enter a realistic age"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Select a gender" }),
  }),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Use +8801XXXXXXXXX or 01XXXXXXXXX"),
  email: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email address"),
  ]),
  condition: z.string().trim().min(2, "Condition is required").max(150),
  notes: z.string().trim().max(1000, "Notes are limited to 1000 characters"),
  doctorId: z.string().min(1, "Select a doctor"),
});

type FormValues = z.infer<typeof schema>;

const EMPTY = {
  name: "",
  age: undefined,
  gender: undefined,
  phone: "",
  email: "",
  condition: "",
  notes: "",
  doctorId: "",
} as unknown as FormValues;

const NO_IMAGE_CHANGE: ProfileImageValue = { file: null, removed: false };

interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Present when editing an existing patient. */
  patient?: Patient | null;
  /** Present when adding a patient under a specific doctor. */
  doctorId?: string;
}

export function PatientFormModal({
  open,
  onClose,
  patient,
  doctorId,
}: PatientFormModalProps) {
  const isEdit = Boolean(patient);
  const [image, setImage] = useState<ProfileImageValue>(NO_IMAGE_CHANGE);
  const { doctors } = useDoctorOptions();
  const [addPatient, { isLoading: adding }] = useAddPatientToDoctorMutation();
  const [updatePatient, { isLoading: updating }] = useUpdatePatientMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });
  const nameValue = watch("name");

  useEffect(() => {
    if (!open) return;
    setImage(NO_IMAGE_CHANGE);
    reset(
      patient
        ? {
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email ?? "",
            condition: patient.condition,
            notes: patient.notes ?? "",
            doctorId: patient.doctor._id,
          }
        : { ...EMPTY, doctorId: doctorId ?? "" },
    );
  }, [open, patient, doctorId, reset]);

  const onSubmit = async ({
    doctorId: selectedDoctorId,
    ...values
  }: FormValues) => {
    try {
      const profile = { file: image.file, removeProfile: image.removed };
      if (patient) {
        await updatePatient({
          id: patient._id,
          body: buildFormData(
            { ...values, doctorId: selectedDoctorId },
            profile,
          ),
        }).unwrap();
        toast.success("Patient updated");
      } else {
        await addPatient({
          doctorId: selectedDoctorId,
          body: buildFormData(values, profile),
        }).unwrap();
        toast.success("Patient added");
      }
      onClose();
    } catch (error) {
      if (!applyServerErrors(error, setError))
        toast.error(getErrorMessage(error));
    }
  };

  const doctorLocked = !isEdit && Boolean(doctorId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Edit patient" : "Add patient"}
      description={
        isEdit
          ? "Update the patient’s information."
          : "Register a new patient under this doctor."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <ProfileImageInput
          name={nameValue}
          currentUrl={patient?.profile}
          value={image}
          onChange={setImage}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Full name"
            htmlFor="patient-name"
            error={errors.name?.message}
            required
            className="sm:col-span-2"
          >
            <Input
              id="patient-name"
              placeholder="Patient name"
              invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>
          <FormField
            label="Age"
            htmlFor="patient-age"
            error={errors.age?.message}
            required
          >
            <Input
              id="patient-age"
              type="number"
              inputMode="numeric"
              min={0}
              invalid={!!errors.age}
              {...register("age", { valueAsNumber: true })}
            />
          </FormField>
          <FormField
            label="Gender"
            htmlFor="patient-gender"
            error={errors.gender?.message}
            required
          >
            <Select
              id="patient-gender"
              defaultValue=""
              invalid={!!errors.gender}
              {...register("gender")}
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
          </FormField>
          <FormField
            label="Phone"
            htmlFor="patient-phone"
            error={errors.phone?.message}
            required
          >
            <Input
              id="patient-phone"
              type="tel"
              placeholder="01812345678"
              invalid={!!errors.phone}
              {...register("phone")}
            />
          </FormField>
          <FormField
            label="Email"
            htmlFor="patient-email"
            error={errors.email?.message}
            hint="Optional"
          >
            <Input
              id="patient-email"
              type="email"
              invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>
          <FormField
            label="Condition"
            htmlFor="patient-condition"
            error={errors.condition?.message}
            required
          >
            <Input
              id="patient-condition"
              placeholder="e.g. Hypertension"
              invalid={!!errors.condition}
              {...register("condition")}
            />
          </FormField>
          <FormField
            label="Doctor"
            htmlFor="patient-doctor"
            error={errors.doctorId?.message}
            required
          >
            <Select
              id="patient-doctor"
              disabled={doctorLocked}
              invalid={!!errors.doctorId}
              {...register("doctorId")}
            >
              <option value="" disabled>
                Select doctor
              </option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} · {doctor.specialization}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            label="Notes"
            htmlFor="patient-notes"
            error={errors.notes?.message}
            hint="Optional"
            className="sm:col-span-2"
          >
            <Textarea
              id="patient-notes"
              invalid={!!errors.notes}
              {...register("notes")}
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={adding || updating}>
            {isEdit ? "Save changes" : "Add patient"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
