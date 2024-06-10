import { inventoryQueryKeys } from "./key";
import {
  getBrandBySapo,
  getCategoryBySapo,
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

export interface IGetInventorySapo {
  keyword?: string;
  page?: number;
  pageSize?: number;
  created_on_max?: string;
  created_on_min?: string;
  created_on_predefined?: string;
  brand_ids?: string;
  category_ids?: string;
}

export const useGetInventoriesBySapo = ({
  keyword,
  page,
  pageSize,
  created_on_max,
  created_on_min,
  brand_ids,
  category_ids,
}: IGetInventorySapo) => {
  const query = useQuery({
    queryKey: inventoryQueryKeys.getInventoriesSapo({
      page,
      keyword,
      created_on_max,
      created_on_min,
      brand_ids,
      category_ids,
    }),
    queryFn: () =>
      getSystemInventoriesSapo({
        page,
        pageSize,
        keyword,
        created_on_max,
        created_on_min,
        brand_ids,
        category_ids,
      }),
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

export const useGetCategoryBySapo = ({
  page,
  pageSize,
  query,
  status,
}: {
  page: number;
  pageSize: number;
  query?: string;
  status: string;
}) => {
  const queryData = useQuery({
    queryKey: inventoryQueryKeys.getCategorySapo({
      page,
      query,
      status,
    }),
    queryFn: () => getCategoryBySapo({ page, pageSize, query, status }),
    select: (data) => {
      const newData = data.data.map((e) => {
        return {
          label: e.name,
          value: e.id,
        };
      });
      return newData;
    },
  });

  return queryData;
};

export const useGetBrandsBySapo = ({
  page,
  pageSize,
  query,
  status,
}: {
  page: number;
  pageSize: number;
  query?: string;
  status: string;
}) => {
  const queryData = useQuery({
    queryKey: inventoryQueryKeys.getBrandSapo({
      page,
      query,
      status,
    }),
    queryFn: () => getBrandBySapo({ page, pageSize, query, status }),
    select: (data) => {
      const newData = data.data.map((e) => {
        return {
          label: e.name,
          value: e.id,
        };
      });
      return newData;
    },
  });

  return queryData;
};
