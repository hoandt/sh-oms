import { adminHeadersList, BACKEND_URL } from "@/lib/config";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { OrganizationPayload } from "@/types/organization";
import axios, { AxiosError } from "axios";
import { toInteger } from "lodash";

const SUB_DOMAIN = "/api/organizations";

export const getOrganization = async ({ options }: { options: string }) => {
  try {
    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN}${options}`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createOrganization = async ({
  data,
}: {
  data: OrganizationPayload;
}) => {
  const organization_endpoint = `${BACKEND_URL}${SUB_DOMAIN}`;
  const { name, taxcode } = data;
  try {
    let bodyContent = JSON.stringify({
      data: {
        name: name,
        taxcode: `${taxcode}`,
      },
    });

    let reqOptions = {
      url: `${organization_endpoint}`,
      method: "POST",
      headers: adminHeadersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    return response.data;
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
