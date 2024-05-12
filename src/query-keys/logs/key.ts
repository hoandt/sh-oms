export const logQueryKeys = {
  getLogs: ({
    pageParam,
    code,
    status
  }: {
    pageParam?: number;
    code?: string;
    status?: string;
  }) => ["get-logs", pageParam, code, status],
};
