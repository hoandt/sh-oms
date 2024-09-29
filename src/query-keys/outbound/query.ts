import { getOutboundDetailSapo } from "@/services/outbound";
import { outboundQueryKeys } from "./key";

import { useQuery } from "@tanstack/react-query";

export interface IGetOutboundSapo {
  keyword?: string;
  saleChannel?: string;
  page?: number;
  pageSize?: number;
  created_on_max?: string;
  created_on_min?: string;
}

export const useGetOutboundDetailBySapo = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: outboundQueryKeys.getOutboundDetailSapo({
      id,
    }),
    queryFn: () => getOutboundDetailSapo({ id }),
  });
  return query;
};
