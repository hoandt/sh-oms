import { DataResponseFromBackend } from "@/types/common";
import { SystemInventory } from "@/types/todo";

export const PAGE_SIZE_TABLE = 15;

export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  return response.json() as Promise<T>;
}

export const standardizeBackendResponse = (
  response: BackendDataResponse
): DataResponseFromBackend => {
  if (response.error) {
    return {
      success: false,
      data: response.error.details?.errors,
      meta: [],
    };
  } else {
    // Success response
    return {
      success: true,
      data: response.data || {},
      meta: response.meta,
    };
  }
};

export function sortArrayByExp(
  array: { id: number; attributes: SystemInventory }[]
) {
  return array.sort((a, b) => {
    if (a.attributes.exp && b.attributes.exp) {
      return new Date(a.attributes.exp) < new Date(b.attributes.exp)
        ? -1
        : new Date(a.attributes.exp) > new Date(b.attributes.exp)
        ? 1
        : 0;
    }
    return 0;
  });
}

export const priceFormat = new Intl.NumberFormat("vi", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
