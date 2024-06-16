import { fetchData } from "@/lib/helpers";
import { IGetInboundBySapo } from "@/query-keys";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { ILocation, InboundSapo } from "@/types/inbound";
import qs from "qs";

function transformData(data: any): any {
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

export const getOperateInbounds = async ({
  code,
  status,
  page = 1,
  pageSize = 15,
}: any) => {
  const endpoint = "/oms-inbounds";

  const params: QueryOptions = {
    filters: {
      status: status ? status.split(",") : undefined,
      code: {
        $contains: code || undefined,
      },
    },
    populate: ["warehouse", "organization", "Item", "Item.system_item_master"],
    pagination: {
      page,
      pageSize,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inbounds/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export const getInbound = async ({ id }: any) => {
  const endpoint = "/oms-inbounds";

  const params: QueryOptions = {
    filters: {
      id: {
        $eq: id,
      },
    },
    populate: ["organization", "Item", "Item.system_item_master"],
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inbounds/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export const updateStatusInbound = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const body = {
    id,
    inbound: {
      status,
    },
  };

  const ENDPOINT = `/api/controller/inbounds/update-status`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export const updateConfirmInbound = async ({ inbound }: { inbound: any }) => {
  const body = {
    inbound,
  };

  const ENDPOINT = `/api/controller/inbounds/confirm-inbound`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export const getInboundsBySapo = async ({
  page,
  pageSize,
  keyword,
  created_on_max,
  created_on_min,
}: IGetInboundBySapo) => {
  const params = {
    page,
    pageSize,
    query: keyword,
    created_on_max,
    created_on_min,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inbounds/getInboundBySapo${queryOptions}`;
  const res: { purchase_orders: InboundSapo[]; metadata: any } =
    await fetchData(ENDPOINT, {
      method: "GET",
    });

  const responses = { data: res?.purchase_orders, meta: res?.metadata };
  return responses;
};

export const getLocationBySapo = async () => {
  const ENDPOINT = `/api/controller/customers/get-location`;
  const res: { locations: ILocation[] } = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const responses = { data: res?.locations };
  return responses;
};

export const getInboundDetailSapo = async ({
  productId,
}: {
  productId: string;
}) => {
  const params = {
    productId,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inbounds/getInboundDetailBySapo${queryOptions}`;
  const res: { purchase_order: InboundSapo } = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const responses = { data: res?.purchase_order };
  return responses;
};
