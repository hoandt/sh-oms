export const logQueryKeys = {
  getLogs: ({ pageParam, code }: { pageParam?: number; code?: string }) => [
    "get-logs",
    pageParam,
    code,
  ],
};
