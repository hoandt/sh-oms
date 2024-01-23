import {
  adminHeadersList,
  BACKEND_URL,
  GHN_SHOP_ID,
  GHN_TOKEN,
  GHN_URL,
  GHTK_TOKEN,
  GHTK_URL,
} from "@/lib/constants";
import { DataResponseFromBackend, QueryOptions } from "@/types/common";
import { DataResponseGHN, DataResponseGHTK } from "@/types/customer";
import axios from "axios";
import { isEmpty, omitBy } from "lodash";
import qs from "qs";

const GHN_DOMAIN_FEE = "/shiip/public-api/v2/shipping-order/fee";
const GHTK_DOMAIN_FEE = "/services/shipment/fee";

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
