import { outboundQueryKeys } from "./key";
import {
  getOutboundDetailSapo,
  getOutboundsBySapo,
} from "@/services/outbounds";
import { useQuery } from "@tanstack/react-query";

export interface IGetOutboundSapo {
  keyword?: string;
  saleChannel?: string;
  page?: number;
  pageSize?: number;
  created_on_max?: string;
  created_on_min?: string;
}

export const useGetOutboundsBySapo = ({
  keyword,
  saleChannel,
  page,
  pageSize,
  created_on_max,
  created_on_min,
}: IGetOutboundSapo) => {
  const query = useQuery({
    queryKey: outboundQueryKeys.getOutboundSapo({
      page,
      keyword,
      saleChannel,
      created_on_max,
      created_on_min,
    }),
    queryFn: () =>
      getOutboundsBySapo({
        page,
        pageSize,
        keyword,
        saleChannel,
        created_on_max,
        created_on_min,
      }),
  });
  return query;
};

export const useGetOutboundDetailBySapo = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: outboundQueryKeys.getOutboundDetailSapo({
      id,
    }),
    queryFn: () => getOutboundDetailSapo({ productId: id }),
  });
  return query;
};
