import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { SHOrder } from "@/types/todo";
import qs from "qs";

export const getSHOrders = async ({
  trackingNumber,
  page = 1,
  pageSize = 15,
}: any) => {
  const endpoint = "/haravan-orders";

  const params: QueryOptions = {
    filters: {
      $or: [
        {
          trackingNumber: {
            $eq: trackingNumber,
          },
        },
        {
          orderNumber: {
            $eq: trackingNumber,
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

  const ENDPOINT = `/api/controller/sh-orders/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend<SHOrder[]> = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const SHOrdersResponses = { data: res.data, meta: res.meta };
  return SHOrdersResponses;
};

export const updateLogs = async ({ id, fulfillment_status }: any) => {
  const body = {
    id,
    fulfillment_status,
  };

  const ENDPOINT = `/api/controller/sh-orders/update`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return res;
};
