import { useQuery } from "@tanstack/react-query";
import { outboundQueryKeys } from "./key";
import { getOperateOutbounds, getOutbound } from "@/services/outbounds";

interface IGetOutbounds {
    status: string;
    code: string;
    page?: number;
    pageSize?: number;
}

export const useGetOutbounds = ({
    code,
    status,
    page,
    pageSize
  }: IGetOutbounds) => {
    const query = useQuery({
      queryKey: outboundQueryKeys.getOutbounds({pageParam: page, status, code}),
      queryFn: () => getOperateOutbounds({ code, status, page, pageSize })
    });
    return query;
  };
  

  interface IGetOutbound {
    id: number;
    page?: number;
    pageSize?: number;
  }
  
  
  export const useGetOutbound = ({
      id
    }: IGetOutbound) => {
      const query = useQuery({
        queryKey: outboundQueryKeys.getOutbound({ id }),
        queryFn: () => getOutbound({ id })
      });
      return query;
  };