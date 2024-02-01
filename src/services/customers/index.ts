import { fetchData } from "@/lib/helpers";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { DataResponseDeliveryMethod } from "@/types/customer";
import {
  AddressDistrict,
  AddressProvince,
  AddressWard,
  OmsUser,
} from "@/types/todo";
import qs from "qs";

export const getProvinces = async () => {
  const params: QueryOptions = {
    pagination: {
      pageSize: 100,
      page: 0,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/customers/get-provinces?options=${queryOptions}`;
  const res: DataResponseFromBackend<AddressProvince[]> = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  return res.data;
};

export const getDistricts = async ({ provinceId }: { provinceId: number }) => {
  const params: QueryOptions = {
    filters: {
      parent_id: {
        $eq: provinceId,
      },
    },
    pagination: {
      pageSize: 100,
      page: 0,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/customers/get-districts?options=${queryOptions}`;
  const res: DataResponseFromBackend<AddressDistrict[]> = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  return res.data;
};

export const getWards = async ({ districtId }: { districtId: number }) => {
  const params: QueryOptions = {
    filters: {
      parent_id: {
        $eq: districtId,
      },
    },
    pagination: {
      pageSize: 100,
      page: 0,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/customers/get-wards?options=${queryOptions}`;
  const res: DataResponseFromBackend<AddressWard[]> = await fetchData(
    ENDPOINT,
    {
      method: "GET",
    }
  );

  return res.data;
};

export const getFeeTracking = async ({ options }: { options: any }) => {
  const ENDPOINT = `/api/controller/customers/get-fees?options=${options}`;

  const res: DataResponseFromBackend<DataResponseDeliveryMethod[]> =
    await fetchData(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(options),
    });

  return res;
};

export const getCustomers = async ({ code, page = 1, pageSize = 15 }: any) => {
  const params: QueryOptions = {
    filters: {
      code: {
        $contains: code || undefined,
      },
    },
    populate: [
      "contact.address_province",
      "contact.address",
      "contact.address_district",
    ],
    pagination: {
      page,
      pageSize,
    },
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/customers/get?options=${queryOptions}`;
  const res: DataResponseFromBackend<OmsUser[]> = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return res;
};
