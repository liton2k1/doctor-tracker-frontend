import type { ApiResponse, User } from "@/types";
import { api } from "./api";
import { toData } from "./transform";

interface LoginRequest {
  email: string;
  password: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ user: User }, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: toData<{ user: User }>,
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: (_response: ApiResponse<undefined>) => undefined,
    }),
    updateMyProfile: build.mutation<User, FormData>({
      query: (body) => ({ url: "/user/me", method: "PATCH", body }),
      transformResponse: toData<User>,
      invalidatesTags: ["Auth"],
    }),
    getMe: build.query<User, void>({
      query: () => "/auth/me",
      transformResponse: toData<User>,
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateMyProfileMutation,
} = authApi;
