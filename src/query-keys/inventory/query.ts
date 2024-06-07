import { inventoryQueryKeys } from "./key";
import {
  getInventoryTransactionBySapo,
  getSystemInventories,
  getSystemInventoriesSapo,
  getSystemInventoryDetailSapo,
} from "@/services/inventories";
import { useQuery } from "@tanstack/react-query";

interface IGetInventory {
  code?: string;
  page?: number;
  pageSize?: number;
}

export const useGetInventories = ({ code, page, pageSize }: IGetInventory) => {
  const query = useQuery({
    queryKey: inventoryQueryKeys.getInventories({ pageParam: page, code }),
    queryFn: () => getSystemInventories({ code, page, pageSize }),
  });
  return query;
};

interface IGetInventorySapo {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export const useGetInventoriesBySapo = ({
  keyword,
  page,
  pageSize,
}: IGetInventorySapo) => {
  const query = useQuery({
    queryKey: inventoryQueryKeys.getInventoriesSapo({
      pageParam: page,
      keyword,
    }),
    queryFn: () => getSystemInventoriesSapo({ page, pageSize, keyword }),
  });
  return query;
};

export const useGetInventoryDetailBySapo = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: inventoryQueryKeys.getInventoryDetailSapo({
      id,
    }),
    queryFn: () => getSystemInventoryDetailSapo({ productId: id }),
  });
  return query;
};

export const useGetInventoryTransactionBySapo = ({
  page,
  pageSize,
  variantId,
  locationId,
}: {
  page: number;
  pageSize: number;
  variantId?: number;
  locationId: number;
}) => {
  const query = useQuery({
    queryKey: inventoryQueryKeys.getTransactionInventorySapo({
      page,
      id: variantId,
    }),
    queryFn: () =>
      getInventoryTransactionBySapo({ page, pageSize, variantId, locationId }),
    enabled: !!variantId,
  });
  return query;
};
