import { IGetInventorySapo } from "./query";

export const inventoryQueryKeys = {
  getInventories: ({
    pageParam,
    code,
  }: {
    pageParam?: number;
    code?: string;
  }) => ["get-inventories", pageParam, code],
  getInventoriesSapo: (payload: IGetInventorySapo) => [
    "get-inventories-sapo",
    { ...payload },
  ],
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
  getBrandSapo: ({
    page,
    query,
    status,
  }: {
    page: number;
    query?: string;
    status?: string;
  }) => ["get-brands-sapo", page, query, status],
  getCategorySapo: ({
    page,
    query,
    status,
  }: {
    page: number;
    query?: string;
    status?: string;
  }) => ["get-category-sapo", page, query, status],
};
