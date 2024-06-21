import { adminHeadersList, BACKEND_URL } from "@/lib/config";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import axios from "axios";
import qs from "qs";

const SUB_DOMAIN_PROVINCES = "/api/address-provinces";
const SUB_DOMAIN_DISTRICTS = "/api/address-districts";
const SUB_DOMAIN_WARDS = "/api/address-wards";
const SUB_DOMAIN = "api/oms-users";

export const getProvinces = async ({ options }: { options: string }) => {
  try {
    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN_PROVINCES}${options}`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDistricts = async ({ options }: { options: string }) => {
  try {
    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN_DISTRICTS}${options}`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getWards = async ({ options }: { options: string }) => {
  try {
    const ENDPOINT = `${BACKEND_URL}${SUB_DOMAIN_WARDS}${options}`;
    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCustomer = async ({ options }: { options: string }) => {
  try {
    const ENDPOINT = `${BACKEND_URL}/${SUB_DOMAIN}${options}`;

    const res: DataResponseFromBackend = await axios.get(ENDPOINT, {
      headers: adminHeadersList,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
