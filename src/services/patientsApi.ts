import { cleanParams } from "@/lib/utils";
import type {
  ApiResponse,
  ListResult,
  Patient,
  PatientFilterOptions,
  PatientListParams,
} from "@/types";
import { api } from "./api";
import { toData, toList } from "./transform";

export const patientsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPatients: build.query<ListResult<Patient>, PatientListParams>({
      query: (params) => ({ url: "/patients", params: cleanParams(params) }),
      transformResponse: (response: ApiResponse<Patient[]>) => toList(response),
      providesTags: ["Patient"],
    }),
    getPatientFilterOptions: build.query<PatientFilterOptions, void>({
      query: () => "/patients/meta/filters",
      transformResponse: toData<PatientFilterOptions>,
      providesTags: ["Patient"],
    }),
    updatePatient: build.mutation<Patient, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/patients/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: toData<Patient>,

      invalidatesTags: ["Patient", "Doctor", "Dashboard"],
    }),
    deletePatient: build.mutation<void, string>({
      query: (id) => ({ url: `/patients/${id}`, method: "DELETE" }),
      invalidatesTags: ["Patient", "Doctor", "Dashboard"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientFilterOptionsQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientsApi;
