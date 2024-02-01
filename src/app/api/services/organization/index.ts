import { adminHeadersList, BACKEND_URL } from "@/lib/config";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import axios from "axios";

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
