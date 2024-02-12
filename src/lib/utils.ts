import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "qs";
import { useQueryClient } from "@tanstack/react-query";
import { customersQueryKeys } from "@/query-keys";
import { OmsUser, Organization } from "@/types/todo";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const enum FILTER_DYNAMIC {
  "ORAGNIZATION" = "organization",
  "USERS" = "users",
}

export const mappingFilterDynamic = (
  params: URLSearchParams,
  filterKey: string
): any => {
  const queryClient = useQueryClient();
  const filtersValue = qs.parse(params.toString())[filterKey] || {};

  if (filterKey === FILTER_DYNAMIC.ORAGNIZATION) {
    const data = queryClient.getQueryData(
      customersQueryKeys.getOrganization({ pageParam: 0 })
    ) as Organization[];

    const dataWithFilter = data?.find((e) => e.id == filtersValue);
    const newValue = dataWithFilter?.attributes.name || undefined;

    if (newValue) {
      params.set(filterKey, newValue);
    }
  }

  if (filterKey === FILTER_DYNAMIC.USERS) {
    const data = queryClient.getQueryData(
      customersQueryKeys.getCustomers({ pageParam: 0 })
    ) as { data: OmsUser[] };

    const dataWithFilter = data?.data?.find((e) => e.id == filtersValue);
    const newValue = dataWithFilter?.attributes.name || undefined;

    if (newValue) {
      params.set(filterKey, newValue);
    }
  }

  return params;
};
