export const inventoryQueryKeys = {
  getInventories: ({
    pageParam,
    code,
  }: {
    pageParam?: number;
    code?: string;
  }) => ["get-inventories", pageParam, code],
  getInventoriesSapo: ({
    pageParam,
    keyword,
  }: {
    pageParam?: number;
    keyword?: string;
  }) => ["get-inventories-sapo", pageParam, keyword],
  getInventoryDetailSapo: ({ id }: { id?: string }) => [
    "get-inventory-detail-sapo",
    id,
  ],
  getTransactionInventorySapo: ({
    page,
    id,
  }: {
    page: number;
    id?: number;
  }) => ["get-txn-inventory-sapo", page, id],
};
