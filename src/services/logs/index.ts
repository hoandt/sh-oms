import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { WMSLog } from "@/types/todo";
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

export const getLogs = async ({
  organization,
  code,
  status,
  page = 1,
  pageSize = 15,
  type,
}: {
  organization: string;
  code?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  type?: string;
}) => {
  const endpoint = "/wms-logs";

  const params: QueryOptions = {
    filters: {
      $and: [
        {
          transaction: {
            $eq: code || undefined,
          },
        },
        {
          organization: {
            id: {
              $eq: organization,
            },
          },
        },
        {
          status: {
            $eq: type || undefined,
          },
        },
        {
          type: {
            $eq: status || undefined,
          },
        },
      ],
    },
    sort: {
      createdAt: "desc",
    },
    pagination: {
      page,
      pageSize,
    },
  };
  console.log(params);
  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/logs/get?endpoint=${endpoint}${queryOptions}`;
  const res: DataResponseFromBackend<WMSLog[]> = await fetchData(ENDPOINT, {
    method: "GET",
  });

  const logsResponses = { data: res.data, meta: res.meta };
  return logsResponses;
};

export const createLogs = async ({ logs }: any) => {
  const endpoint = `/api/controller/logs/create`;

  const body = {
    ...logs,
  };

  const res: DataResponseFromBackend = await fetchData(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return res;
};

export const deleteLogs = async ({ id }: any) => {
  const body = {
    id,
  };

  const ENDPOINT = `/api/controller/logs/delete`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "DELETE",
    body: JSON.stringify(body),
  });

  return res;
};

export const updateLogs = async ({ id, videoUrl, status }: any) => {
  const body = {
    id,
    videoUrl,
    status,
  };

  const ENDPOINT = `/api/controller/logs/update`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return res;
};
