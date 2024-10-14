import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import {
  WMSLocationData,
  WMSLocations,
  WMSLog,
  WMSPromotions,
} from "@/types/todo";
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

export const getLocations = async ({
  sku,

  page = 1,
  pageSize = 15,
}: {
  sku: string;
  page?: number;
  pageSize?: number;
}) => {
  const endpoint = "/locations";

  const params: QueryOptions = {
    filters: {
      $or: [
        {
          sku: {
            $eq: sku || undefined,
          },
        },
        {
          barcode: {
            $eq: sku || undefined,
          },
        },
      ],
    },
    sort: {
      createdAt: "desc",
    },
    pagination: {
      page,
      pageSize,
    },
  };
  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/locations/get?endpoint=${endpoint}${queryOptions}`;

  const res: DataResponseFromBackend<WMSLocationData[]> = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  if (res.data && res.data.length > 0) {
    const logsResponses = { data: res.data, meta: res.meta };

    return logsResponses;
  } else {
    return res;
  }
};
