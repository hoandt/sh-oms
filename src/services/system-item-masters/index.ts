import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import qs from "qs";

export const getSystemItemMaster = async ({
  code,
  page = 1,
  pageSize = 15,
}: any) => {
  const params: QueryOptions = {
    filters: {
      code: {
        $contains: code || undefined,
      },
    },
    pagination: {
      page,
      pageSize,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/system-item-masters/get?options=${queryOptions}`;
  const res: DataResponseFromBackend = await fetchData(ENDPOINT, {
    method: "GET",
  });

  console.log({ res, ENDPOINT });

  const response = { data: res.data, meta: res.meta };
  return response;
};
