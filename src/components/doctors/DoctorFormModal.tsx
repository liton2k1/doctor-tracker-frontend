"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { applyServerErrors, getErrorMessage } from "@/lib/errors";
import { buildFormData } from "@/lib/formData";
import {
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
} from "@/services/doctorsApi";
import type { Doctor } from "@/types";
import {
  ProfileImageInput,
  type ProfileImageValue,
} from "@/components/common/ProfileImageInput";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  specialization: z
    .string()
    .trim()
    .min(2, "Specialization is required")
    .max(100),
  hospital: z.string().trim().min(2, "Hospital is required").max(150),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Use +8801XXXXXXXXX or 01XXXXXXXXX"),
  email: z.string().trim().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};
const NO_IMAGE_CHANGE: ProfileImageValue = { file: null, removed: false };

interface DoctorFormModalProps {
  open: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export function DoctorFormModal({
  open,
  doctor,
  onClose,
}: DoctorFormModalProps) {
  const isEdit = Boolean(doctor);
  const [image, setImage] = useState<ProfileImageValue>(NO_IMAGE_CHANGE);
  const [createDoctor, { isLoading: creating }] = useCreateDoctorMutation();
  const [updateDoctor, { isLoading: updating }] = useUpdateDoctorMutation();

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
    if (open) {
      setImage(NO_IMAGE_CHANGE);
      reset(
        doctor
          ? {
              name: doctor.name,
              specialization: doctor.specialization,
              hospital: doctor.hospital,
              phone: doctor.phone,
              email: doctor.email,
            }
          : EMPTY,
      );
    }
  }, [open, doctor, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const body = buildFormData(values, {
        file: image.file,
        removeProfile: image.removed,
      });
      if (doctor) {
        await updateDoctor({ id: doctor._id, body }).unwrap();
        toast.success("Doctor updated");
      } else {
        await createDoctor(body).unwrap();
        toast.success("Doctor created");
      }
      onClose();
    } catch (error) {
      const hasFieldErrors = applyServerErrors(error, setError);
      if (!hasFieldErrors) toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit doctor" : "Add doctor"}
      description={
        isEdit ? "Update the doctor’s details." : "Create a new doctor profile."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <ProfileImageInput
          name={nameValue}
          currentUrl={doctor?.profile}
          value={image}
          onChange={setImage}
        />
        <FormField
          label="Full name"
          htmlFor="doctor-name"
          error={errors.name?.message}
          required
        >
          <Input
            id="doctor-name"
            placeholder="Dr. Jane Smith"
            invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Specialization"
            htmlFor="doctor-spec"
            error={errors.specialization?.message}
            required
          >
            <Input
              id="doctor-spec"
              placeholder="Cardiology"
              invalid={!!errors.specialization}
              {...register("specialization")}
            />
          </FormField>
          <FormField
            label="Hospital"
            htmlFor="doctor-hospital"
            error={errors.hospital?.message}
            required
          >
            <Input
              id="doctor-hospital"
              placeholder="Square Hospital"
              invalid={!!errors.hospital}
              {...register("hospital")}
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Phone"
            htmlFor="doctor-phone"
            error={errors.phone?.message}
            required
          >
            <Input
              id="doctor-phone"
              type="tel"
              placeholder="01712345678"
              invalid={!!errors.phone}
              {...register("phone")}
            />
          </FormField>
          <FormField
            label="Email"
            htmlFor="doctor-email"
            error={errors.email?.message}
            required
          >
            <Input
              id="doctor-email"
              type="email"
              placeholder="doctor@hospital.com"
              invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={creating || updating}>
            {isEdit ? "Save changes" : "Create doctor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
