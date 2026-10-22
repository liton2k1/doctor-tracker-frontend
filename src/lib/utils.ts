import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatDate = (value: string): string =>
  dateFormatter.format(new Date(value));

export const getInitials = (name: string): string =>
  name
    .replace(/^dr\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/** Drops empty values so they never reach the query string. */
export const cleanParams = <T extends object>(
  params: T,
): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  ) as Record<string, string | number>;

/** yyyy-mm-dd in UTC (matches the backend's UTC bucketing). */
export const toISODate = (date: Date): string =>
  date.toISOString().slice(0, 10);

export const isSafeRedirect = (value: string | null): value is string =>
  !!value && value.startsWith("/") && !value.startsWith("//");
