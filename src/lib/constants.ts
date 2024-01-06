export const API_ADMIN_ENDPOINT = {
    get: "/api/admin/get?endpoint=",
    update: "/api/admin/update",
    create: "/api/admin/create",
    delete: "/api/admin/delete"
  };

  export const defaultImage = '/assets/images/image-placeholder.png';
export const DURATION_TOAST = 1500;
  
  export const BACKEND_URL = process.env.BACKEND_URL;
  export const FRONTEND_URL = process.env.FRONTEND_URL;
  export const NEXT_SUPER_TOKEN = process.env.NEXT_SUPER_TOKEN;
  
  export const SYSTEM_STORAGE_BIN = process.env.NEXT_PUBLIC_STORAGE_BIN;
  export const DEFAULT_PICKING_CART =
    process.env.NEXT_PUBLIC_DEFAULT_PICKING_CART;
  export const MASTER_CUSTOMER_ID = process.env.NEXT_PUBLIC_MASTER_CUSTOMER_ID;
  export const MASTER_CUSTOMER_WAREHOUSE = process.env.NEXT_PUBLIC_MASTER_WAREHOUSE_ID;
  export const EXT_API = process.env.NEXT_EXT_API || 'http://localhost:3001';
  
  export const BACKEND_ENDPOINT = `${BACKEND_URL}/api`;
  export let adminHeadersList = {
    Accept: "*/*",
    Authorization: "Bearer " + NEXT_SUPER_TOKEN,
    "Content-Type": "application/json"
  };