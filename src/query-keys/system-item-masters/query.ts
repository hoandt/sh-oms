import { systemItemMasterQueryKeys } from "./key";
import { getSystemItemMaster } from "@/services/system-item-masters";
import { getTransactions } from "@/services/transactions";
import { useQuery } from "@tanstack/react-query";

interface IGetSystemItemMaster {
  code: string;
  page?: number;
  pageSize?: number;
}

export const useGetSystemItemMaster = ({
  code,
  page,
  pageSize,
}: IGetSystemItemMaster) => {
  const query = useQuery({
    queryKey: systemItemMasterQueryKeys.getSystemItemMaster({
      pageParam: page,
    }),
    queryFn: () => getSystemItemMaster({ page, pageSize }),
  });

  return query;
};
