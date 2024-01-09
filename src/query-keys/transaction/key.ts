export const transactionQueryKeys = {
  getTransactions: ({ pageParam }: { pageParam?: number }) => [
    "get-transactions",
    pageParam,
  ],
  getTransactionsByInboundId: ({
    pageParam,
    id,
  }: {
    pageParam?: number;
    id: number;
  }) => ["get-transactions-inbound", pageParam, id],
};
