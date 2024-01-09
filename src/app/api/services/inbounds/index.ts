import { adminHeadersList, BACKEND_URL } from "@/lib/constants";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import axios from "axios";
import qs from "qs";

const SUB_DOMAIN = "/api/oms-inbounds";

export const getInbound = async ({ options }: { options: QueryOptions }) => {
  try {
    const params: QueryOptions = {
      ...options,
    };

    const queryOptions = qs.stringify(params, {
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

export const updateInbound = async ({
  id,
  inbound,
}: {
  id: number;
  inbound: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;
    const res: DataResponseFromBackend = await axios.put(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...inbound,
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

export const postInbound = async ({ inbound }: { inbound: any }) => {
  try {
    const endpoint = `${SUB_DOMAIN}`;

    const res: DataResponseFromBackend = await axios.post(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...inbound,
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

export const deleteInbound = async ({ id }: { id: number }) => {
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
