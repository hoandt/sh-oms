import { getLogs } from "@/services";
import { logQueryKeys } from "./key";
import { useQuery } from "@tanstack/react-query";

interface IGetLogs {
  organization: number;
  code?: string;
  page?: number;
  pageSize?: number;
}

export const useGetLogs = ({
  organization,
  code,
  page,
  pageSize,
}: IGetLogs) => {
  const query = useQuery({
    queryKey: logQueryKeys.getLogs({ pageParam: page, code }),
    queryFn: () => getLogs({ organization, code, page, pageSize }),
  });
  return query;
};
