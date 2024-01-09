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

export const getOperateOutbounds = async ({
  code,
  status,
  page = 1,
  pageSize = 15,
}: any) => {
  const endpoint = "/oms-outbounds";

  const params: QueryOptions = {
    filters: {
      status: status ? status.split(",") : undefined,
      code: {
        $contains: code || undefined,
      },
    },
    populate: ["orderItems", "orderItems.system_item_master"],
    pagination: {
      page,
      pageSize,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/outbounds/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export const getOutbound = async ({ id, page = 1, pageSize = 15 }: any) => {
  const endpoint = "/oms-outbounds";

  const params: QueryOptions = {
    filters: {
      id: {
        $eq: id,
      },
    },
    populate: ["orderItems", "orderItems.system_item_master"],
    pagination: {
      page,
      pageSize,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/outbounds/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export const deleteOutbound = async ({ id }: any) => {
  const body = {
    id,
    outbound: {},
  };

  const ENDPOINT = `/api/controller/outbounds/delete`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "DELETE",
    body: JSON.stringify(body),
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export const updateFlowOutbound = async ({ outbounds }: any) => {
  const endpoint = `/api/controller/outbounds/confirm-outbound-flow`;

  const body = {
    payload: {
      outbounds,
    },
  };

  const res: DataResponseFromBackend = await fetchData(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  console.log({ res });
  return res;
};
