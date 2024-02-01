import { adminHeadersList, BACKEND_URL } from "@/lib/config";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import axios from "axios";
import qs from "qs";

const SUB_DOMAIN = "/api/system-inventories";

export const getInventory = async ({ options }: { options: QueryOptions }) => {
  try {
    const params: QueryOptions = {
      ...options,
    };

    const queryOptions = qs.stringify(params, {
      encodeValuesOnly: true,
      addQueryPrefix: true,
    });

    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}${queryOptions}`;
    const res: DataResponseFromBackend<any> = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateInventory = async ({
  id,
  inventory,
}: {
  id: number;
  inventory: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const res: DataResponseFromBackend = await axios.put(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...inventory,
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

export const postInventory = async ({ inventory }: { inventory: any }) => {
  try {
    const endpoint = `${SUB_DOMAIN}`;

    const res: DataResponseFromBackend<any> = await axios.post(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...inventory,
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

export const deleteInventory = async ({ id }: { id: number }) => {
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
