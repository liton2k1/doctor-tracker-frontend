import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  credentials: "include",
});

const PUBLIC_ENDPOINTS = ["login", "logout"];

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    !PUBLIC_ENDPOINTS.includes(api.endpoint) &&
    typeof window !== "undefined"
  ) {
    await rawBaseQuery(
      { url: "/auth/logout", method: "POST" },
      api,
      extraOptions,
    );
    if (!window.location.pathname.startsWith("/login")) {
      window.location.assign(
        `/login?next=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "Doctor", "Patient", "Dashboard"],
  endpoints: () => ({}),
});
