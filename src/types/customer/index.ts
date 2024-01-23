type Fee = {
  name: string;
  fee: number;
  insurance_fee: number;
  include_vat: string;
  cost_id: string;
  delivery_type: string;
  a: string;
  dt: string;
  extFees: any[];
  ship_fee_only: number;
  promotion_key: string;
  delivery: boolean;
};

export type DataResponseGHTK = {
  success: boolean;
  message: string;
  fee: Fee;
};

export type DataResponseGHN = {
  code: number;
  message: string;
  data: {
    total: number;
    service_fee: number;
    insurance_fee: number;
    pick_station_fee: number;
    coupon_value: number;
    r2s_fee: number;
    return_again: number;
    document_return: number;
    double_check: number;
    cod_fee: number;
    pick_remote_areas_fee: number;
    deliver_remote_areas_fee: number;
    cod_failed_fee: number;
  };
};

export type DataResponseDeliveryMethod = {
  total_fee: number;
  name: string;
  duration: string;
};
