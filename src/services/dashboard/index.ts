import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { WMSLog, WMSPromotions } from "@/types/todo";
import qs from "qs";

export function transformData(data: any): any {
  if (data && data.data && Array.isArray(data.data)) {
    data.data.forEach((item: any) => {
      if (item.attributes) {
        Object.assign(item, item.attributes);
        item.id = item.id;
        delete item.attributes;
      }
    });
  }
  return data;
}

export const getDashboard = async ({
  organization,
}: {
  organization: string;
  page?: number;
  pageSize?: number;
}) => {
  const ENDPOINT = `/api/controller/dashboard/?organization=${organization}`;
  const res: any = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return res;
};
