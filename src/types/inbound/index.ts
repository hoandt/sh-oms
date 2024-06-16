export interface InboundSapo {
  id: number;
  tenant_id: number;
  location_id: number;
  account_id: number;
  assignee_id: number;
  code: string;
  reference: null;
  supplier_id: number;
  supplier_data: SupplierData;
  order_supplier_id: null;
  order_supplier_code: null;
  billing_address: Address;
  supplier_address: Address;
  email: null;
  phone_number: null;
  line_items: InboundSapoLineItem[];
  applied_discount: null;
  landed_cost_lines: any[];
  note: string;
  tags: string[];
  price_list_id: number;
  taxes_included: boolean;
  tax_lines: TaxLine[];
  transactions: any[];
  receipts: Receipt[];
  refunds: any[];
  total_discounts: number;
  total_line_items_price: number;
  subtotal_price: number;
  total_tax: number;
  total_landed_costs: number;
  total_price: number;
  total_refunds: null;
  status: string;
  financial_status: string;
  receive_status: string;
  payment_status: string;
  refund_payment_status: null;
  receive_inventory_status: string;
  refund_status: null;
  due_on: null;
  activated_account_id: number;
  cancelled_on: null;
  cancel_reason: null;
  cancelled_account_id: null;
  activated_on: Date;
  completed_on: Date;
  closed_on: null;
  closed_account_id: null;
  created_on: Date;
  modified_on: Date;
  interconnection_status: null;
}

export interface Address {
  id: number;
  label: null;
  first_name: null;
  last_name: null;
  address1: string;
  address2: null;
  email: null;
  phone_number: null;
  country: string;
  city: null;
  district: null;
  ward?: null;
  zip_code: null;
  created_on?: Date;
  modified_on?: Date;
  status?: string;
}

export interface InboundSapoLineItem {
  id: number;
  product_id: number;
  variant_id: number;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  applied_discount: null;
  discount_allocation: number;
  tax_lines: TaxLine[];
  accepted_quantity: number;
  remaining_quantity: number;
  note: null;
  product_type: ProductType;
  serials: any[];
  lots_dates: any[];
  tax_included: boolean;
  excluded_tax_price: number;
  excluded_tax_begin_amount: number;
  excluded_discount_allocation: number;
  order_supplier_line_item_id: null;
  packsize: boolean;
  pack_size_quantity: number;
  pack_size_root_id: null;
}

export enum ProductType {
  Normal = "normal",
}

export interface TaxLine {
  title: null;
  rate: number;
  price: number;
}

export interface Receipt {
  id: number;
  account_id: number;
  code: string;
  reference: null;
  line_items: ReceiptLineItem[];
  landed_cost_lines: any[];
  landed_cost_allocation_method: string;
  total_landed_costs: number;
  total_price: number;
  note: null;
  processed_on: Date;
  created_on: Date;
  tenant_id: number;
  location_id: number;
  purchase_order_id: number;
  purchase_order_code: null;
  supplier_id: number;
}

export interface ReceiptLineItem {
  id: number;
  line_item_id: number;
  line_item: InboundSapoLineItem;
  accepted_quantity: number;
  landed_cost_allocation: number;
  note: null;
  serials: any[];
  lots_dates: any[];
}

export interface SupplierData {
  code: string;
  name: string;
  email: null;
  phone_number: null;
  addresses: Address[];
}


export interface ILocation {
  id:           number;
  tenant_id:    number;
  created_on:   Date;
  modified_on:  Date;
  status:       string;
  address1:     string;
  address2:     string;
  city:         string;
  country:      string;
  district:     string;
  code:         string;
  label:        string;
  suburb:       null;
  zip_code:     string;
  type:         string;
  holds_stock:  string;
  country_id:   number;
  city_id:      number;
  district_id:  number;
  phone_number: string;
  coordinates:  null;
  ward:         string;
  start_date:   Date;
  end_date:     Date;
  note:         null;
  init:         boolean;
}
