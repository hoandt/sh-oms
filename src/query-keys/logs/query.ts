import { getLogs } from "@/services";
import { logQueryKeys } from "./key";
import { useQuery } from "@tanstack/react-query";

interface IGetLogs {
  organization: number;
  code?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useGetLogs = ({
  organization,
  code,
  status,
  page,
  pageSize,
}: IGetLogs) => {
  const query = useQuery({
    queryKey: logQueryKeys.getLogs({ pageParam: page, code, status }),
    queryFn: () =>
      getLogs({
        organization: `${organization}`,
        code,
        page,
        pageSize,
        status,
      }),
  });
  return query;
};
