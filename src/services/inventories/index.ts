import { API_ADMIN_ENDPOINT } from "@/lib/config";
import { fetchData } from "@/lib/helpers";
import { IGetInventorySapo } from "@/query-keys";
import {
  DataResponseFromBackend,
  DataResponseFromBackendSapo,
  QueryOptions,
} from "@/types/common";
import {
  IBrandsSapo,
  ICategorySapo,
  IIventoriesSapo,
  IIventorySapo,
  IVariantInventory,
} from "@/types/inventories";
import qs from "qs";

function transformData(data: any): any {
  if (data && data.data && Array.isArray(data.data)) {
    data.data.forEach((item: any) => {
      if (item.attributes) {
        Object.assign(item, item.attributes);
        item.id = item.id;
        delete item.attributes;
      }
    });
  }
  return data;
}

export const getSystemInventories = async ({
  code,
  status,
  page = 1,
  pageSize = 25,
}: any) => {
  const endpoint = "/system-inventories";

  const params: QueryOptions = {
    filters: {},
    populate: "system_item_master",
    pagination: {
      page,
      pageSize,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const outboundResponses = { data: res.data, meta: res.meta };
  return transformData(outboundResponses);
};

export type IResponse = {
  products: any;
  metadata: any;
};

export const getSystemInventoriesSapo = async ({
  page = 1,
  pageSize = 25,
  keyword,
  created_on_min,
  created_on_max,
  brand_ids,
  category_ids,
}: IGetInventorySapo) => {
  const params = {
    page,
    pageSize,
    query: keyword,
    created_on_min,
    created_on_max,
    brand_ids,
    category_ids,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/getInventory?params=${queryOptions}`;
  const res: DataResponseFromBackendSapo<IIventoriesSapo[]> = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  const outboundResponses = { data: res?.variants, meta: res?.metadata };
  return outboundResponses;
};

export const getSystemInventoryDetailSapo = async ({
  productId,
}: {
  productId: string;
}) => {
  const params = {
    productId,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/getInventoryDetail?params=${queryOptions}`;
  const res: { product: IIventorySapo } = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const responses = { data: res?.product };
  return responses;
};

export const getVariantInventoryDetailSapo = async ({
  productId,
}: {
  productId: string;
}) => {
  const params = {
    productId,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/getLotInventoryDetail?params=${queryOptions}`;
  const res: { lots_dates: any } = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const responses = { data: res?.lots_dates };
  return responses;
};

export const getInventoryTransactionBySapo = async ({
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
  const params = {
    page,
    pageSize,
    variantId,
    locationId,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/getReportsInventory${queryOptions}`;
  const res: { variant_inventories: IVariantInventory[]; metadata: any } =
    await fetchData(ENDPOINT, {
      method: "GET",
    });

  const responses = { data: res?.variant_inventories, meta: res?.metadata };
  return responses;
};

export const getCategoryBySapo = async ({
  page,
  pageSize,
  query,
  status,
}: {
  page: number;
  pageSize: number;
  query?: string;
  status?: string;
}) => {
  const params = {
    page,
    pageSize,
    query,
    status,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/getCategoryInventory${queryOptions}`;
  const res: { categories: ICategorySapo[]; metadata: any } = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  const responses = { data: res?.categories, meta: res?.metadata };
  return responses;
};

export const getBrandBySapo = async ({
  page,
  pageSize,
  query,
  status,
}: {
  page: number;
  pageSize: number;
  query?: string;
  status?: string;
}) => {
  const params = {
    page,
    pageSize,
    query,
    status,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/inventories/getBrandInventory${queryOptions}`;
  const res: { brands: IBrandsSapo[]; metadata: any } = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  const responses = { data: res?.brands };
  return responses;
};
