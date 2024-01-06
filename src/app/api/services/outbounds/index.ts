import qs from "qs";
import axios from "axios";
import { adminHeadersList, BACKEND_URL } from "@/lib/constants";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";

const SUB_DOMAIN = "/api/oms-outbounds";

export const getOutbound = async ({ id, options }: { id: number, options: QueryOptions }) => {
  try {
    const params: QueryOptions = {
      ...options
    };

    const queryOptions = qs.stringify(params, {
      encodeValuesOnly: true,
      addQueryPrefix: true
    });

    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}${queryOptions}`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateOutbound = async ({
  id,
  outbounds
}: {
  id: number;
  outbounds: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const bodyData = JSON.stringify({
      data: {
        ...outbounds
      }
    });

    const res: DataResponseFromBackend = await axios.put(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...outbounds
        }
      },
      {
        headers: adminHeadersList
      }
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postOutbound = async ({
  id,
  outbounds
}: {
  id: number;
  outbounds: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const bodyData = JSON.stringify({
      data: {
        ...outbounds
      }
    });

    const res: DataResponseFromBackend = await axios.post(
      `${BACKEND_URL}${endpoint}`,
      {
        body: bodyData
      },
      {
        headers: adminHeadersList
      }
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOutbound = async ({ id }: { id: number }) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const res: DataResponseFromBackend = await axios.delete(
      `${BACKEND_URL}${endpoint}`,
      {
        headers: adminHeadersList
      }
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};
