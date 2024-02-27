import { inboundQueryKeys } from "./key";
import { getInbound, getOperateInbounds } from "@/services/inbounds";
import { useQuery } from "@tanstack/react-query";

interface IGetInbounds {
  status: string;
  code: string;
  page?: number;
  pageSize?: number;
}

export const useGetInbounds = ({
  code,
  status,
  page,
  pageSize,
}: IGetInbounds) => {
  const query = useQuery({
    queryKey: inboundQueryKeys.getInbounds({ pageParam: page, status, code }),
    queryFn: () => getOperateInbounds({ code, status, page, pageSize }),
  });
  return query;
};

interface IGetInbound {
  id: number;
  page?: number;
  pageSize?: number;
}

export const useGetInbound = ({ id }: IGetInbound) => {
  const query = useQuery({
    queryKey: inboundQueryKeys.getInbound({ id }),
    queryFn: () => getInbound({ id }),
  });
  return query;
};
