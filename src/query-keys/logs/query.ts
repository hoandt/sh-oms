import { getLogs } from "@/services";
import { logQueryKeys } from "./key";
import { useQuery } from "@tanstack/react-query";

interface IGetLogs {
  code?: string;
  page?: number;
  pageSize?: number;
}

export const useGetLogs = ({
  code,
  page,
  pageSize,
}: IGetLogs) => {
  const query = useQuery({
    queryKey: logQueryKeys.getLogs({ pageParam: page, code }),
    queryFn: () => getLogs({ code, page, pageSize }),
  });
  return query;
};
