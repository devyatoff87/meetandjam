import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventsQuery } from './api/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDatetimeLocal = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const log = (info: [string, unknown]) => {
  console.log(info[0].toUpperCase() + ": ");
  console.log(info[1]);
  console.log("-------------------------------------------------");
};

export const queryParamsBuilder = (query: EventsQuery = {}) => {
  const qs = new URLSearchParams();
  if (query.page) qs.set("page", String(query.page));
  if (query.limit) qs.set("limit", String(query.limit));
  if (query.search) qs.set("search", query.search);
  if (query.category) qs.set("category", query.category);

  return qs.toString() ? `?${qs}` : "";
};
