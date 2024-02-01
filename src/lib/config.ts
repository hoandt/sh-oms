export const API_ADMIN_ENDPOINT = {
  get: "/api/admin/get?endpoint=",
  update: "/api/admin/update",
  create: "/api/admin/create",
  delete: "/api/admin/delete",
};

export const defaultImage = "/assets/images/image-placeholder.png";
export const DURATION_TOAST = 1500;

export const BACKEND_URL = process.env.BACKEND_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const NEXT_SUPER_TOKEN = process.env.NEXT_SUPER_TOKEN;

export const SYSTEM_STORAGE_BIN = process.env.NEXT_PUBLIC_STORAGE_BIN;
export const DEFAULT_PICKING_CART =
  process.env.NEXT_PUBLIC_DEFAULT_PICKING_CART;
export const MASTER_CUSTOMER_ID = process.env.NEXT_PUBLIC_MASTER_CUSTOMER_ID;
export const MASTER_CUSTOMER_WAREHOUSE =
  process.env.NEXT_PUBLIC_MASTER_WAREHOUSE_ID;
export const EXT_API = process.env.NEXT_EXT_API || "http://localhost:3001";

export const BACKEND_ENDPOINT = `${BACKEND_URL}/api`;

export let adminHeadersList = {
  Accept: "*/*",
  Authorization: "Bearer " + NEXT_SUPER_TOKEN,
  "Content-Type": "application/json",
};

export enum METHOD_DELIVERY {
  GHN = "GHN",
  GHTK = "GHTK",
  VNP = "VNP",
}

export const GHN_URL = process.env.NEXT_GHN_URL;
export const GHN_TOKEN =
  process.env.NEXT_GHN_TOKEN || "0ef02582-3733-11ee-b1d4-92b443b7a897";
export const GHN_SHOP_ID = process.env.NEXT_GHN_SHOP_ID || "125467";

export const GHTK_URL = process.env.NEXT_GHTK_URL;
export const GHTK_TOKEN =
  process.env.NEXT_GHTK_TOKEN || "0ef02582-3733-11ee-b1d4-92b443b7a897";

export const VNPOST_URL = process.env.NEXT_VNPOST_URL;
export const VNPOST_TOKEN =
  process.env.NEXT_VNPOST_TOKEN || "0ef02582-3733-11ee-b1d4-92b443b7a897";

export const VERSION_API = process.env.NEXT_VERSION_API || 1;
