import { fetchData } from "@/lib/helpers";
import { IGetInboundBySapo } from "@/query-keys";
import { IOutbound } from "@/types/outbound";
import qs from "qs";

export const getOutboundsBySapo = async ({
  page,
  pageSize,
  keyword,
  saleChannel,
  created_on_max,
  created_on_min,
}: IGetInboundBySapo) => {
  const params = {
    page,
    pageSize,
    query: keyword,
    saleChannel: saleChannel,
    created_on_max,
    created_on_min,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/outbounds/getSapoOutbound${queryOptions}`;
  const res: { orders: IOutbound[]; metadata: any } = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  const responses = { data: res?.orders, meta: res?.metadata };
  return responses;
};

export const getOutboundDetailSapo = async ({
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

  const ENDPOINT = `/api/controller/outbounds/getOutboundDetailBySapo${queryOptions}`;
  const res: { order: IOutbound } = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const responses = { data: res?.order };
  return responses;
};
