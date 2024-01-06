export const outboundQueryKeys = {
  getOutbounds: ({pageParam, status, code}:{pageParam?: number, status: any, code: string}) => ["get-outbounds", pageParam, status, code],
  getOutbound: ({id}:{id: number}) => ["get-outbound", id],
};
