import { API_ADMIN_ENDPOINT } from "@/lib/constants";
import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
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

export const getSystemInventories = async ({
  code,
  status,
  page = 1,
  pageSize = 15,
}: any) => {
  const endpoint = "/system-inventories";

  const params: QueryOptions = {
    filters: {},
    populate: "system_item_master",
    pagination: {
      page,
      pageSize,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};
