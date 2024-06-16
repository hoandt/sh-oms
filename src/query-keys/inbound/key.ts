import { IGetInboundBySapo } from "./query";

export const inboundQueryKeys = {
  getInbounds: ({
    pageParam,
    status,
    code,
  }: {
    pageParam?: number;
    status: any;
    code: string;
  }) => ["get-inbounds", pageParam, status, code],
  getInbound: ({ id }: { id: number }) => ["get-inbound", id],
  getInboundBySapo: (payload: IGetInboundBySapo) => [
    "get-inbound-sapo",
    payload.keyword,
    {...payload}
  ],
  getLocationBySapo: () => ["get-location-sapo"],
  getInboundDetailSapo: ({ id }: { id?: string }) => [
    "get-inbound-detail-sapo",
    id,
  ],
};
