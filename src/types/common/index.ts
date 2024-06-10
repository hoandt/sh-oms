import { z } from "zod";

export type QueryOptions = {
  sort?: any;
  filters?: any;
  populate?: any;
  fields?: any;
  pagination?: {
    pageSize: number;
    page: number;
  };
};

export type DataResponseFromBackend<T = {}> = {
  total?: number;
  responseStatus?: number;
  success: boolean;
  data: T;
  meta: any;
};

export type DataResponseFromBackendSapo<T = {}> = {
  total?: number;
  responseStatus?: number;
  success: boolean;
  variants: T;
  metadata: any;
};

export enum TabSideBarInfor {
  PRODUCT = "PRODUCT",
  TRACKING = "TRACKING",
  CUSTOMER = "CUSTOMER",
}

export const formShippingSchema = z.object({
  address_delivery: z.string().min(3, "Định dạng không đúng"),
  address_ward_delivery: z.coerce
    .number({ invalid_type_error: "Xin nhập phường/xã" })
    .gt(0, "Xin nhập"),
  address_district_delivery: z.coerce
    .number({ invalid_type_error: "Xin nhập quận/huyện" })
    .gt(0, "Xin nhập"),
  address_province_delivery: z.coerce
    .number({ invalid_type_error: "Xin nhập tỉnh/thành" })
    .gt(0, "Xin nhập"),
  object_delivery: z.any().optional(),

  address_pick: z.string().min(3, "Định dạng không đúng"),
  address_ward_pick: z.coerce
    .number({ invalid_type_error: "Xin nhập phường/xã" })
    .gt(0, "Xin nhập"),
  address_district_pick: z.coerce
    .number({ invalid_type_error: "Xin nhập quận/huyện" })
    .gt(0, "Xin nhập"),
  address_province_pick: z.coerce
    .number({ invalid_type_error: "Xin nhập tỉnh/thành" })
    .gt(0, "Xin nhập"),
  object_pick: z.any().optional(),

  weight: z.string(),
});

export type DataOptions = {
  label: string | number;
  value: string | number;
};

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};
