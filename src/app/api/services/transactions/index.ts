import qs from "qs";
import axios from "axios";
import { adminHeadersList, BACKEND_URL } from "@/lib/constants";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";

const SUB_DOMAIN = "/api/system-transactions";

export const getTransaction = async ({ options}: {  options: QueryOptions }) => {
  try {
    const params: QueryOptions = {
      ...options
    };

    const queryOptions = qs.stringify(params, {
      encodeValuesOnly: true,
      addQueryPrefix: true
    });

    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}${queryOptions}`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateTransaction = async ({
  id,
  transaction
}: {
  id: number;
  transaction: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const res: DataResponseFromBackend = await axios.put(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...transaction
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

export const postTransaction = async ({
  transaction
}: {
  transaction: any;
}) => {
  try {
    const endpoint = `${SUB_DOMAIN}`;

    const res: DataResponseFromBackend = await axios.post(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...transaction
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

export const deleteTransaction = async ({ id }: { id: number }) => {
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