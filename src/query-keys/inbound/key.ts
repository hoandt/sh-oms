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
};
