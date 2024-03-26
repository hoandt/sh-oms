import { adminHeadersList, BACKEND_URL } from "@/lib/config";
import { RegisterTenant } from "@/types/authen";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import axios, { AxiosError } from "axios";
import qs from "qs";
import { createOrganization } from "../organization";
import { toInteger } from "lodash";

const SUB_DOMAIN = "/api/auth/local";

export const getUser = async ({ options }: { options: QueryOptions }) => {
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

export const updateUser = async ({ id, user }: { id: number; user: any }) => {
  try {
    const endpoint = `${SUB_DOMAIN}/${id}`;

    const res: DataResponseFromBackend = await axios.put(
      `${BACKEND_URL}${endpoint}`,
      {
        data: {
          ...user,
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

export const postUser = async ({ data }: { data: RegisterTenant }) => {
  const register_endpoint = `${BACKEND_URL}/api/auth/local/register`;

  const {
    firstName,
    lastName,
    username,
    password,
    referralCode,
    email,
    phone,
  } = data;

  try {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };
    let organizationRes = await createOrganization({
      data: {
        name: `${lastName}` || `${username}`,
        taxcode: toInteger(phone),
      },
    });
    let organizationId = organizationRes.data.id;

    let bodyContent = JSON.stringify({
      firstName,
      lastName,
      username,
      password,
      side: "SHIPPER",
      email,
      referralCode,
      phone,
      organization: organizationId,
    });

    let reqOptions = {
      url: `${register_endpoint}`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    return response;
  } catch (error) {
    //check if error is AxiosError
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        return axiosError.response.data;
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.log("axiosError.request");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", "axiosError.message");
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", "error");
    }
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
    //check if error is AxiosError
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(">>>", axiosError.response.data);
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.log("axiosError.request");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", "axiosError.message");
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", "error");
    }
  }
};
