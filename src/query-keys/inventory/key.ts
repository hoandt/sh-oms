export const inventoryQueryKeys = {
  getInventories: ({pageParam, code}:{pageParam?: number, code: string}) => ["get-inventories", pageParam, code],
};
