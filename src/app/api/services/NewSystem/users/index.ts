import { adminHeadersList, BACKEND_URL, VERSION_API } from "@/lib/config";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import axios from "axios";
import qs from "qs";

const SUB_DOMAIN = `/api/v${VERSION_API}/User`;

export const getAll = async ({ options }: { options: QueryOptions }) => {
  try {
    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}/getAll`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUserByTenant = async ({
  id,
  user,
}: {
  id: number;
  user: any;
}) => {
  try {
    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}/getAllUserByTenant`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllRoleByUser = async ({
  transaction,
}: {
  transaction: any;
}) => {
  try {
    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}/getAllRoleByUser`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async ({ id }: { id: number }) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const res: DataResponseFromBackend = await axios.post(
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

export const assignRoleToUser = async ({ id }: { id: number }) => {
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

export const changePassword = async ({ id }: { id: number }) => {
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

export const activeUser = async ({ id }: { id: number }) => {
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

export const deactiveUser = async ({ id }: { id: number }) => {
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

export const deleteUser = async ({ id }: { id: number }) => {
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

export const removeRoleOfUser = async ({ id }: { id: number }) => {
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
