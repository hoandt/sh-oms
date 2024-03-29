import { transactionQueryKeys } from "./key";
import { getTransactions } from "@/services/transactions";
import { useQuery } from "@tanstack/react-query";

interface IGetTransactionByInboundId {
  id: number;
  page?: number;
  pageSize?: number;
}

export const useGetTransactionsByInboundId = ({
  id,
  page,
  pageSize,
}: IGetTransactionByInboundId) => {
  const query = useQuery({
    queryKey: transactionQueryKeys.getTransactionsByInboundId({
      pageParam: page,
      id,
    }),
    queryFn: () => getTransactions({ page, pageSize, id }),
  });
  return query;
};
