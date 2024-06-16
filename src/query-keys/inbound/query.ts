import { inboundQueryKeys } from "./key";
import {
  getInbound,
  getInboundDetailSapo,
  getInboundsBySapo,
  getLocationBySapo,
  getOperateInbounds,
} from "@/services/inbounds";
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

export interface IGetInboundBySapo {
  keyword?: string;
  page?: number;
  pageSize?: number;
  created_on_max?: string;
  created_on_min?: string;
}

export const useGetInboundBySapo = ({
  page,
  pageSize,
  created_on_max,
  created_on_min,
  keyword,
}: IGetInboundBySapo) => {
  const query = useQuery({
    queryKey: inboundQueryKeys.getInboundBySapo({
      page,
      pageSize,
      created_on_max,
      created_on_min,
      keyword,
    }),
    queryFn: () =>
      getInboundsBySapo({
        page,
        pageSize,
        created_on_max,
        created_on_min,
        keyword,
      }),
  });
  return query;
};

export const useGetLocationBySapo = () => {
  const query = useQuery({
    queryKey: inboundQueryKeys.getLocationBySapo(),
    queryFn: () => getLocationBySapo(),
  });
  return query;
};

export const useGetInboundDetailBySapo = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: inboundQueryKeys.getInboundDetailSapo({
      id,
    }),
    queryFn: () => getInboundDetailSapo({ inboundId: id }),
  });
  return query;
};
