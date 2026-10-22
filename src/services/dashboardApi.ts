import type {
  DashboardOverview,
  Distributions,
  PatientsPerDoctorItem,
  Timeline,
  TimelineParams,
} from "@/types";
import { api } from "./api";
import { toData } from "./transform";

export const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOverview: build.query<DashboardOverview, void>({
      query: () => "/dashboard/overview",
      transformResponse: toData<DashboardOverview>,
      providesTags: ["Dashboard"],
    }),
    getPatientsPerDoctor: build.query<PatientsPerDoctorItem[], number | void>({
      query: (limit) => ({
        url: "/dashboard/patients-per-doctor",
        params: { limit: limit ?? 8 },
      }),
      transformResponse: toData<PatientsPerDoctorItem[]>,
      providesTags: ["Dashboard"],
    }),
    getTimeline: build.query<Timeline, TimelineParams>({
      query: (params) => ({ url: "/dashboard/timeline", params }),
      transformResponse: toData<Timeline>,
      providesTags: ["Dashboard"],
    }),
    getDistributions: build.query<Distributions, void>({
      query: () => ({ url: "/dashboard/distributions", params: { limit: 6 } }),
      transformResponse: toData<Distributions>,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetPatientsPerDoctorQuery,
  useGetTimelineQuery,
  useGetDistributionsQuery,
} = dashboardApi;
