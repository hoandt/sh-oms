import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { AddressDistrict, AddressProvince, AddressWard } from "@/types/todo";
import qs from "qs";

export const getProvinces = async () => {
  const params: QueryOptions = {};

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/customers/get-provinces?options=${queryOptions}`;
  const res: AddressProvince[] = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return res;
};

export const getDistricts = async ({ provinceId }: { provinceId: number }) => {
  const ENDPOINT = `/api/controller/customers/get-districts?options=${provinceId}`;
  const res: AddressDistrict[] = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return res;
};

export const getWards = async ({ districtId }: { districtId: number }) => {
  const ENDPOINT = `/api/controller/customers/get-wards?options=${districtId}`;
  const res: AddressWard[] = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return res;
};
