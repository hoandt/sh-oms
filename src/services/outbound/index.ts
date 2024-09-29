import { fetchData } from "@/lib/helpers";
import { IOutbound } from "@/types/outbound";
import qs from "qs";

export const getOutboundDetailSapo = async ({ id }: { id: string }) => {
  const params = {
    id,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/sapo-outbounds/getOutboundDetailBySapo${queryOptions}`;
  const res: {
    order: IOutbound;
  } = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return res;
};
