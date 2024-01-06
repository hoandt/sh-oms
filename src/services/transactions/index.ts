import { API_ADMIN_ENDPOINT } from "@/lib/constants";
import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import qs from "qs";

export function transformData(data: any): any {
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

export const getTransactions = async ({
    id,
    page = 1,
    pageSize = 15
  }: any) => {
    const endpoint = "/system-transactions";
  
    const params: QueryOptions = {
      filters: {
        system_inventory:{
          id: {
            $eq: id
          }
        }
      },
      pagination: {
        page,
        pageSize
      }
    };
  
    const queryOptions = qs.stringify(params, {
      encodeValuesOnly: true,
      addQueryPrefix: true
    });
  
    const ENDPOINT = `/api/controller/transactions/get?endpoint=${endpoint}${queryOptions}`;
    const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
      method: "GET"
    });
  
    const transactionResponses = { data: res.data, meta: res.meta };
    return transformData(transactionResponses);
};