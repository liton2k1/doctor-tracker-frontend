import type { ApiResponse, ListResult, PageMeta } from "@/types";

export const toData = <T>(response: ApiResponse<T>): T => response.data;

const toPageMeta = (response: ApiResponse<unknown[]>): PageMeta => {
  const {
    page = 1,
    limit = response.data.length,
    total = response.data.length,
    totalPage = 1,
  } = response.meta ?? {};
  return {
    page,
    limit,
    total,
    totalPages: totalPage,
    hasNext: page < totalPage,
    hasPrev: page > 1,
  };
};

export const toList = <T>(response: ApiResponse<T[]>): ListResult<T> => ({
  items: response.data,
  meta: toPageMeta(response),
});
