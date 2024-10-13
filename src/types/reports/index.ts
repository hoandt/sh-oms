export type IReportOrderToday = {
  marketplaceIds?: string;
  from?: number | string;
  to?: number | string;
};

export type IReportOrderTodayResponse = {
  pending: number;
  packed: number;
  shipping: number;
  in_cancelled: number;
  total: number;
  quantity: number;
};

export type IReportBestSeller = {
  marketplaceIds?: string;
  from?: number | string;
  to?: number | string;
};

export type IReportBestSellerResponse = {
  dim_variation_id: number;
  connection_id: number;
  item_id: string;
  variation_id: string;
  variation_name: string;
  image: string;
  sapo_product_id: number;
  sapo_variant_id: number;
  sku: null;
  sapo_sku: null;
  mapping: boolean;
  quantity: null;
  revenue: number;
  order_number: number;
  cancelled_quantity: number;
  cancelled_order_number: number;
  cancelled_rate: number;
  link: null;
};

export type IReportOverviewChannel = {
  marketplaceIds?: string;
  from?: number | string;
  to?: number | string;
};

export type IReportOverviewChannelResponse = {
  name: string;
  quantity: number;
  connection_id: number;
  connection_name: null;
  current_total: number;
  last_period_total: number;
  change_rate_total: number;
  rate_total: number;
};

export type IReportPriceOrders = {
  marketplaceIds?: string;
  from?: number | string;
  to?: number | string;
};

export type IReportPriceOrdersResponse = {
  time: string;
  total: number;
  quantity: number;
  average: number;
};

export type IReportComparation = {
  current_time: string;
  last_period_time: string;
  day_count: number;
  current_revenue: number;
  last_period_revenue: number;
  change_rate_revenue: number;
  current_order_count: number;
  last_period_order_count: number;
  change_rate_order_count: number;
  current_average_revenue: number;
  last_period_average_revenue: number;
  change_rate_average_revenue: number;
};

export type IReportPriceOrdersChannel = {
  marketplaceIds?: string;
  from?: number | string;
  to?: number | string;
};

export type IReportPriceOrdersChannelResponse = {
  id: number;
  channel_type: number;
  channel_name: string;
  connection_ids: number[];
  total: number;
  quantity: number;
};
