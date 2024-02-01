import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { OmsUser, Organization } from "@/types/todo";
import qs from "qs";

export const getOrganization = async ({
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

  const ENDPOINT = `/api/controller/customers/get-organization?options=${queryOptions}`;
  const res: DataResponseFromBackend<Organization[]> = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  return res.data;
};
