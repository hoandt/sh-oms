import { adminHeadersList, BACKEND_URL } from "@/lib/config";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import axios from "axios";
import qs from "qs";

const SUB_DOMAIN = "/api/system-item-masters";

export const getSystemItemMaster = async ({
  options,
}: {
  options: QueryOptions;
}) => {
  try {
    console.log({ options });
    const queryOptions = qs.stringify(options, {
      encodeValuesOnly: true,
      addQueryPrefix: true,
    });

    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}${queryOptions}`;

    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSystemItemMaster = async ({
  id,
  outbounds,
}: {
  id: number;
  outbounds: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const bodyData = JSON.stringify({
      data: {
        ...outbounds,
      },
    });

    const res: DataResponseFromBackend = await axios.put(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...outbounds,
        },
      },
      {
        headers: adminHeadersList,
      }
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postSystemItemMaster = async ({
  id,
  outbounds,
}: {
  id: number;
  outbounds: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const bodyData = JSON.stringify({
      data: {
        ...outbounds,
      },
    });

    const res: DataResponseFromBackend = await axios.post(
      `${BACKEND_URL}${endpoint}`,
      {
        body: bodyData,
      },
      {
        headers: adminHeadersList,
      }
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSystemItemMaster = async ({ id }: { id: number }) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const res: DataResponseFromBackend = await axios.delete(
      `${BACKEND_URL}${endpoint}`,
      {
        headers: adminHeadersList,
      }
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};
