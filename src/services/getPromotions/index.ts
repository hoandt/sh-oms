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

export const getPromotions = async ({
  organization,

  page = 1,
  pageSize = 15,
}: {
  organization: string;
  page?: number;
  pageSize?: number;
}) => {
  const endpoint = "/promotions";

  const params: QueryOptions = {
    filters: {
      $and: [
        {
          organization: {
            $eq: organization || undefined,
          },
        },
        {
          active: {
            $eq: true || undefined,
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

  const ENDPOINT = `/api/controller/promotions/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend<WMSPromotions[]> = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  const logsResponses = { data: res.data, meta: res.meta };
  return logsResponses;
};
