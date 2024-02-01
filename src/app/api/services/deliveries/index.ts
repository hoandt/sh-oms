import {
  adminHeadersList,
  GHN_SHOP_ID,
  GHN_TOKEN,
  GHN_URL,
  GHTK_TOKEN,
  GHTK_URL,
  VNPOST_TOKEN,
  VNPOST_URL,
} from "@/lib/config";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import {
  DataResponseGHN,
  DataResponseGHTK,
  DataResponseVNPost,
} from "@/types/customer";
import axios from "axios";
import { isEmpty, omitBy } from "lodash";

const GHN_DOMAIN_FEE = "/shiip/public-api/v2/shipping-order/fee";
const GHTK_DOMAIN_FEE = "/services/shipment/fee";
const VNPOST_TOKEN_DOMAIN_FEE = "/customer-partner/ServicesCharge";

export const getGHNMethodGetFee = async ({ payload }: { payload: any }) => {
  try {
    const ENDPOINT = `${GHN_URL}${GHN_DOMAIN_FEE}`;
    const res: DataResponseFromBackend<DataResponseGHN> = await axios.post(
      ENDPOINT,
      payload,
      {
        headers: { ...adminHeadersList, ShopId: GHN_SHOP_ID, Token: GHN_TOKEN },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getGHTKMethod = async ({ payload }: { payload: any }) => {
  try {
    const ENDPOINT = `${GHTK_URL}${GHTK_DOMAIN_FEE}?${new URLSearchParams(
      omitBy(payload, isEmpty)
    ).toString()}`;

    const res: DataResponseFromBackend<DataResponseGHTK> = await axios.post(
      ENDPOINT,
      {},
      {
        headers: { ...adminHeadersList, Token: GHTK_TOKEN },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getVNPostMethod = async ({ payload }: { payload: any }) => {
  try {
    const ENDPOINT = `${VNPOST_URL}${VNPOST_TOKEN_DOMAIN_FEE}`;

    const res: DataResponseFromBackend<DataResponseVNPost[]> = await axios.post(
      ENDPOINT,
      payload,
      {
        headers: { ...adminHeadersList, Token: VNPOST_TOKEN },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
