import { cleanParams } from "@/lib/utils";
import type {
  ApiResponse,
  Doctor,
  DoctorFilterOptions,
  DoctorListParams,
  ListResult,
  Patient,
  PatientListParams,
} from "@/types";
import { api } from "./api";
import { toData, toList } from "./transform";

export type DoctorPatientsArgs = { id: string } & Omit<
  PatientListParams,
  "doctorId"
>;

export const doctorsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDoctors: build.query<ListResult<Doctor>, DoctorListParams>({
      query: (params) => ({ url: "/doctors", params: cleanParams(params) }),
      transformResponse: (response: ApiResponse<Doctor[]>) => toList(response),
      providesTags: ["Doctor"],
    }),
    getDoctor: build.query<Doctor, string>({
      query: (id) => `/doctors/${id}`,
      transformResponse: toData<Doctor>,
      providesTags: ["Doctor"],
    }),
    getDoctorFilterOptions: build.query<DoctorFilterOptions, void>({
      query: () => "/doctors/meta/filters",
      transformResponse: toData<DoctorFilterOptions>,
      providesTags: ["Doctor"],
    }),
    createDoctor: build.mutation<Doctor, FormData>({
      query: (body) => ({ url: "/doctors", method: "POST", body }),
      transformResponse: toData<Doctor>,
      invalidatesTags: ["Doctor", "Dashboard"],
    }),
    updateDoctor: build.mutation<Doctor, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/doctors/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: toData<Doctor>,
      invalidatesTags: ["Doctor", "Patient", "Dashboard"],
    }),
    deleteDoctor: build.mutation<void, string>({
      query: (id) => ({ url: `/doctors/${id}`, method: "DELETE" }),
      invalidatesTags: ["Doctor", "Dashboard"],
    }),

    getDoctorPatients: build.query<ListResult<Patient>, DoctorPatientsArgs>({
      query: ({ id, ...params }) => ({
        url: `/doctors/${id}/patients`,
        params: cleanParams(params),
      }),
      transformResponse: (response: ApiResponse<Patient[]>) => toList(response),
      providesTags: ["Patient"],
    }),
    addPatientToDoctor: build.mutation<
      Patient,
      { doctorId: string; body: FormData }
    >({
      query: ({ doctorId, body }) => ({
        url: `/doctors/${doctorId}/patients`,
        method: "POST",
        body,
      }),
      transformResponse: toData<Patient>,
      invalidatesTags: ["Doctor", "Patient", "Dashboard"],
    }),
    removePatientFromDoctor: build.mutation<
      void,
      { doctorId: string; patientId: string }
    >({
      query: ({ doctorId, patientId }) => ({
        url: `/doctors/${doctorId}/patients/${patientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor", "Patient", "Dashboard"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useGetDoctorFilterOptionsQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  useGetDoctorPatientsQuery,
  useAddPatientToDoctorMutation,
  useRemovePatientFromDoctorMutation,
} = doctorsApi;
