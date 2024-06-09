export interface IIventoriesSapo {
  id: number;
  tenant_id: number;
  location_id: number;
  created_on: Date;
  modified_on: Date;
  category_id: number;
  brand_id: null;
  product_id: number;
  composite: boolean;
  init_price: number;
  init_stock: number;
  variant_retail_price: number;
  variant_whole_price: number;
  variant_import_price: number;
  image_id: null;
  description: null;
  name: string;
  opt1: string;
  opt2: string;
  opt3: null;
  product_name: string;
  product_status: null;
  status: string;
  sellable: boolean;
  sku: string;
  barcode: string;
  taxable: boolean;
  weight_value: number;
  weight_unit: string;
  unit: null;
  packsize: boolean;
  packsize_quantity: null;
  packsize_root_id: null;
  packsize_root_sku: null;
  packsize_root_name: null;
  tax_included: boolean;
  input_vat_id: number;
  output_vat_id: number;
  input_vat_rate: null;
  output_vat_rate: null;
  product_type: string;
  variant_prices: VariantPrice[];
  inventories: IInventory[] | null;
  images: null;
  composite_items: null;
  warranty: boolean;
  warranty_term_id: null;
  expiration_alert_time: null;
}

export interface IIventorySapo {
  id: number;
  tenant_id: number;
  created_on: Date;
  modified_on: Date;
  status: string;
  brand: null;
  description: string;
  image_path: null;
  image_name: null;
  name: string;
  opt1: string;
  opt2: string;
  opt3: null;
  category_id: number;
  category: string;
  category_code: string;
  tags: string;
  medicine: boolean;
  product_type: string;
  variants: Variant[];
  options: Option[];
  images: any[];
  product_medicines: null;
}

export interface Option {
  id: number;
  name: string;
  position: number;
  values: string[];
}

export interface Variant {
  id: number;
  tenant_id: number;
  location_id: number;
  created_on: Date;
  modified_on: Date;
  category_id: number;
  brand_id: null;
  product_id: number;
  composite: boolean;
  init_price: number;
  init_stock: number;
  variant_retail_price: number;
  variant_whole_price: number;
  variant_import_price: number;
  image_id: null;
  description: null;
  name: string;
  opt1: string;
  opt2: string;
  opt3: null;
  product_name: string;
  product_status: null;
  status: string;
  sellable: boolean;
  sku: string;
  barcode: string;
  taxable: boolean;
  weight_value: number;
  weight_unit: string;
  unit: null;
  packsize: boolean;
  packsize_quantity: null;
  packsize_root_id: null;
  packsize_root_sku: null;
  packsize_root_name: null;
  tax_included: boolean;
  input_vat_id: number;
  output_vat_id: number;
  input_vat_rate: null;
  output_vat_rate: null;
  product_type: string;
  variant_prices: VariantPrice[];
  inventories: { [key: string]: number | null }[];
  images: null;
  composite_items: null;
  warranty: boolean;
  warranty_term_id: null;
  expiration_alert_time: null;
}

export interface VariantPrice {
  id: number;
  value: number;
  included_tax_price: number;
  name: string;
  price_list_id: number;
  price_list: PriceList;
}

export interface PriceList {
  id: number;
  tenant_id: number;
  created_on: Date;
  modified_on: Date;
  code: string;
  currency_id: number;
  name: string;
  is_cost: boolean;
  currency_symbol: string;
  currency_iso: string;
  status: string;
  init: boolean;
}

export interface IVariantInventory {
  location_id: number;
  issued_at_utc: Date;
  trans_object_code: string;
  tenant_id: number;
  source: string;
  location_label: string;
  log_root_id: number;
  log_type_name: string;
  trans_object_id: number;
  trans_type: number;
  onhand_adj: number;
  onhand: number;
  account_name: string;
  mac: number;
  id: number;
}
const sampleInventory = [
  {
    location_id: 719032,
    variant_id: 284290545,
    mac: 0,
    amount: 0,
    on_hand: 0,
    available: 0,
    committed: 0,
    incoming: 0,
    onway: 0,
    min_value: null,
    max_value: null,
    bin_location: null,
    wait_to_pack: 0,
    modified_on: null,
  },
];

export interface IInventory {
  location_id: number;
  variant_id: number;
  mac: number;
  amount: number;
  on_hand: number;
  available: number;
  committed: number;
  incoming: number;
  onway: number;
  min_value: number | null;
  max_value: number | null;
  bin_location: string | null;
  wait_to_pack: number;
  modified_on: string | null;
}
