import { useGetDoctorsQuery } from "@/services/doctorsApi";

/** Doctors for <select> inputs (backend caps page size at 100). */
export function useDoctorOptions() {
  const { data, isLoading } = useGetDoctorsQuery({
    page: 1,
    limit: 100,
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    from: "",
    to: "",
    specialization: "",
    hospital: "",
  });
  return { doctors: data?.items ?? [], isLoading };
}
