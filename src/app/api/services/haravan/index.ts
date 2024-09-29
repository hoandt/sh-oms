import axios from "axios";
const token =
  "4142598ED9B2F0AB4B6D3DA85C2D44D4AF6CF3EFA7B20A840C7C00A0EFC4C8A0";
const endpoint = "https://apis.haravan.com";

//${endpoint}/com/orders.json
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
const getCusomters = async () => {
  try {
    const response = await axios.get(`${endpoint}/com/customers.json`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

type OrderParams = {
  ids?: string;
  limit?: number;
  page?: number;
  since_id?: string;
  created_at_min?: string;
  created_at_max?: string;
  updated_at_min?: string;
  updated_at_max?: string;
  processed_at_min?: string;
  processed_at_max?: string;
  financial_status?:
    | "pending"
    | "paid"
    | "partially_paid"
    | "refunded"
    | "voided"
    | "partially_refunded"
    | "";
  fulfillment_status?: "unshipped" | "shipped" | "partial" | "";
  status?: "open" | "closed" | "cancelled" | "any" | "";
  fields?: string;
  order?: string;
};
export const getOrders = async ({
  ids = "",
  limit = 10,
  page = 1,
  since_id = "",
  created_at_min = "",
  created_at_max = "",
  updated_at_min = "",
  updated_at_max = "",
  processed_at_min = "",
  processed_at_max = "",
  financial_status = "",
  fulfillment_status = "",
  status = "",
  fields = "",
  order = "",
}: OrderParams) => {
  try {
    const response = await axios.get(`/api/controller/haravan`, {
      headers,
      params: {
        ids,
        limit,
        page,
        since_id,
        created_at_min,
        created_at_max,
        updated_at_min,
        updated_at_max,
        processed_at_min,
        processed_at_max,
        financial_status,
        fulfillment_status,
        status,
        fields,
        order,
      },
    });
    return response;
    // return response.data as { orders: HaravanOrder[] };
  } catch (error) {
    console.error(error);
  }
};

interface HaravanOrderAddress {
  address1: string | null;
  address2: string | null;
  city: string | null;
  company: string | null;
  country: string;
  first_name: string;
  id: number;
  last_name: string | null;
  phone: string | null;
  province: string;
  zip: string | null;
  name: string;
  province_code: string;
  country_code: string;
  default: boolean;
  district: string;
  district_code: string;
  ward: string;
  ward_code: string;
}

interface HaravanOrderClientDetails {
  accept_language: string | null;
  browser_ip: string | null;
  session_hash: string | null;
  user_agent: string | null;
  browser_height: number | null;
  browser_width: number | null;
}

interface HaravanOrderCustomer {
  accepts_marketing: boolean;
  addresses: any[]; // Assuming addresses is an array, could be more specific if more info is provided
  created_at: string;
  default_address: HaravanOrderAddress | null;
  email: string;
  phone: string | null;
  first_name: string | null;
  id: number;
  last_name: string | null;
  last_order_id: number | null;
  last_order_name: string | null;
  note: string | null;
  orders_count: number;
  state: string;
  tags: string | null;
  total_spent: number;
  updated_at: string;
  verified_email: boolean;
  birthday: string | null;
  gender: string | null;
  last_order_date: string | null;
  multipass_identifier: string | null;
}

interface HaravanOrderLineItemProperties {
  name: string;
  value: string;
}

interface HaravanOrderLineItem {
  fulfillable_quantity: number;
  fulfillment_service: string | null;
  fulfillment_status: string;
  grams: number;
  id: number;
  price: number;
  product_id: number | null;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  title: string;
  variant_id: number | null;
  variant_title: string;
  vendor: string | null;
  name: string;
  variant_inventory_management: string | null;
  properties: HaravanOrderLineItemProperties[] | null;
  product_exists: boolean;
}

interface HaravanOrderFulfillment {
  created_at: string;
  id: number;
  order_id: number;
  receipt: string | null;
  status: string;
  tracking_company: string;
  tracking_company_code: string | null;
  tracking_numbers: string[];
  tracking_number: string;
  tracking_url: string | null;
  tracking_urls: string[];
  updated_at: string;
  line_items: HaravanOrderLineItem[];
}

interface HaravanOrderShippingLine {
  code: string;
  price: number;
  source: string | null;
  title: string;
}

interface HaravanOrderTransaction {
  amount: number;
  authorization: string | null;
  created_at: string;
  device_id: string | null;
  gateway: string;
  id: number;
  kind: string;
  order_id: number;
  receipt: string | null;
  status: string | null;
  user_id: number;
  location_id: number;
  payment_details: string | null;
  parent_id: string | null;
  currency: string;
  haravan_transaction_id: string | null;
  external_transaction_id: string | null;
}

interface HaravanOrderNoteAttribute {
  name: string;
  value: string;
}

interface HaravanOrderImage {
  src: string;
}

interface HaravanOrderAppliedDiscounts {
  [key: string]: any;
}

interface HaravanOrderDiscountAllocations {
  [key: string]: any;
}

interface HaravanOrderMainLineItem {
  fulfillable_quantity: number;
  fulfillment_service: string | null;
  fulfillment_status: string;
  grams: number;
  id: number;
  price: number;
  price_original: number;
  price_promotion: number;
  product_id: number | null;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  title: string;
  variant_id: number | null;
  variant_title: string;
  vendor: string | null;
  type: string | null;
  name: string;
  gift_card: boolean;
  taxable: boolean;
  tax_lines: string | null;
  product_exists: boolean;
  barcode: string;
  properties: HaravanOrderLineItemProperties[];
  applied_discounts: HaravanOrderAppliedDiscounts[];
  total_discount: number;
  image: HaravanOrderImage;
  not_allow_promotion: boolean;
  ma_cost_amount: number;
  actual_price: number;
  discount_allocations: HaravanOrderDiscountAllocations | null;
}

interface HaravanOrder {
  billing_address: HaravanOrderAddress;
  browser_ip: string | null;
  buyer_accepts_marketing: boolean;
  cancel_reason: string | null;
  cancelled_at: string | null;
  cart_token: string;
  checkout_token: string;
  client_details: HaravanOrderClientDetails;
  closed_at: string | null;
  created_at: string;
  currency: string;
  customer: HaravanOrderCustomer;
  discount_codes: any[]; // Assuming discount_codes is an array, could be more specific if more info is provided
  email: string;
  financial_status: string;
  fulfillments: HaravanOrderFulfillment[];
  fulfillment_status: string;
  tags: string;
  gateway: string;
  gateway_code: string | null;
  id: number;
  landing_site: string | null;
  landing_site_ref: string | null;
  source: string;
  line_items: HaravanOrderMainLineItem[];
  name: string;
  note: string;
  number: number;
  order_number: string;
  processing_method: string | null;
  referring_site: string | null;
  refunds: any[]; // Assuming refunds is an array, could be more specific if more info is provided
  shipping_address: HaravanOrderAddress;
  shipping_lines: HaravanOrderShippingLine[];
  source_name: string;
  subtotal_price: number;
  tax_lines: string | null;
  taxes_included: boolean;
  token: string;
  total_discounts: number;
  total_line_items_price: number;
  total_price: number;
  total_tax: number;
  total_weight: number;
  updated_at: string;
  transactions: HaravanOrderTransaction[];
  note_attributes: HaravanOrderNoteAttribute[];
  confirmed_at: string;
  closed_status: string;
  cancelled_status: string;
  confirmed_status: string;
  assigned_location_id: number;
  assigned_location_name: string;
  assigned_location_at: string;
  exported_confirm_at: string | null;
  user_id: number;
  device_id: string | null;
  location_id: number;
  location_name: string;
  ref_order_id: number;
  ref_order_date: string | null;
  ref_order_number: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  payment_url: string | null;
  contact_email: string;
  order_processing_status: string;
  prev_order_id: number | null;
  prev_order_number: string | null;
  prev_order_date: string | null;
  redeem_model: string | null;
  confirm_user: number;
  risk_level: string | null;
  discount_applications: any[] | null; // Assuming discount_applications is an array, could be more specific if more info is provided
}
