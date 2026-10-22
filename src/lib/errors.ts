import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

interface ApiErrorBody {
  message?: string;
  errorSources?: { path: string; message: string }[];
}

const getBody = (error: unknown): ApiErrorBody | undefined => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === "object" && data !== null) return data as ApiErrorBody;
  }
  return undefined;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: unknown }).status;
    if (status === "FETCH_ERROR")
      return "Cannot reach the server. Check your connection.";
  }
  return getBody(error)?.message ?? fallback;
};

export const applyServerErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean => {
  const sources = getBody(error)?.errorSources;
  if (!Array.isArray(sources) || sources.length === 0) return false;

  let applied = false;
  for (const { path, message } of sources) {
    if (path) {
      setError(path as Path<T>, { type: "server", message });
      applied = true;
    }
  }
  return applied;
};
