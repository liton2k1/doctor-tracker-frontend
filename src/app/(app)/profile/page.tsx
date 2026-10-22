"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { applyServerErrors, getErrorMessage } from "@/lib/errors";
import { buildFormData } from "@/lib/formData";
import { formatDate } from "@/lib/utils";
import { useGetMeQuery, useUpdateMyProfileMutation } from "@/services/authApi";
import {
  ProfileImageInput,
  type ProfileImageValue,
} from "@/components/common/ProfileImageInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { FormField, Input } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name can’t be more than 30 characters"),
  phone: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Use +8801XXXXXXXXX or 01XXXXXXXXX"),
  ]),
  address: z.string().trim().max(200, "Address can’t exceed 200 characters"),
});

type FormValues = z.infer<typeof schema>;

const NO_IMAGE_CHANGE: ProfileImageValue = { file: null, removed: false };

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateMyProfileMutation();
  const [image, setImage] = useState<ProfileImageValue>(NO_IMAGE_CHANGE);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", address: "" },
  });
  const nameValue = watch("name");

  useEffect(() => {
    if (user)
      reset({
        name: user.name,
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
  }, [user, reset]);

  const imageChanged = Boolean(image.file) || image.removed;

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile(
        buildFormData(values, {
          file: image.file,
          removeProfile: image.removed,
        }),
      ).unwrap();
      setImage(NO_IMAGE_CHANGE);
      toast.success("Profile updated");
    } catch (error) {
      if (!applyServerErrors(error, setError))
        toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        title="My profile"
        description="Update your personal details and profile photo."
      />

      <Card className="max-w-2xl p-5 sm:p-6">
        {isLoading || !user ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <ProfileImageInput
              name={nameValue}
              currentUrl={user.profile}
              value={image}
              onChange={setImage}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Full name"
                htmlFor="profile-name"
                error={errors.name?.message}
                required
                className="sm:col-span-2"
              >
                <Input
                  id="profile-name"
                  invalid={!!errors.name}
                  {...register("name")}
                />
              </FormField>
              <FormField
                label="Phone"
                htmlFor="profile-phone"
                error={errors.phone?.message}
                hint="Optional"
              >
                <Input
                  id="profile-phone"
                  type="tel"
                  placeholder="01712345678"
                  invalid={!!errors.phone}
                  {...register("phone")}
                />
              </FormField>
              <FormField
                label="Address"
                htmlFor="profile-address"
                error={errors.address?.message}
                hint="Optional"
              >
                <Input
                  id="profile-address"
                  invalid={!!errors.address}
                  {...register("address")}
                />
              </FormField>
            </div>

            <dl className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Mail className="h-3.5 w-3.5" /> Email
                </dt>
                <dd className="mt-0.5 truncate text-slate-900">{user.email}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" /> Role
                </dt>
                <dd className="mt-0.5">
                  <Badge tone="brand">{user.role}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">
                  Member since
                </dt>
                <dd className="mt-0.5 text-slate-900">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                disabled={!isDirty && !imageChanged}
                onClick={() => {
                  reset({
                    name: user.name,
                    phone: user.phone ?? "",
                    address: user.address ?? "",
                  });
                  setImage(NO_IMAGE_CHANGE);
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                loading={saving}
                disabled={!isDirty && !imageChanged}
              >
                Save changes
              </Button>
            </div>
          </form>
        )}
      </Card>
    </>
  );
}
