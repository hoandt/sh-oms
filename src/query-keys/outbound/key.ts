import { IGetOutboundSapo } from "./query";

export const outboundQueryKeys = {
  getOutboundSapo: (payload: IGetOutboundSapo) => ["get-outbound-sapo", payload],
  getOutboundDetailSapo: ({ id }: { id?: string }) => [
    "get-outbound-detail-sapo",
    id,
  ],
};
