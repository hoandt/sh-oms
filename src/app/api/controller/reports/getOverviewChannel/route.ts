import {
  fetchDeliveryServicesProviders,
  fetchOverviewChannel,
} from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

const dataChannels = [
  {
    id: 143704,
    tenant_id: 69252,
    client_key: null,
    secret_key: null,
    access_token: null,
    refresh_token: null,
    name: "Pura Dor Việt Nam Official",
    logo: "https://cf.shopee.vn/file/vn-11134216-7r98o-lx7yhez773rvaf",
    email: null,
    channel_type: 1,
    channel_identity: "1003486568",
    initialized: true,
    craw_products_status: false,
    created_at: 1727069125,
    updated_at: 1728797740,
    token_expired_at: 1728812140,
    refresh_expired_at: 1731389740,
    expired_in: 1758605125,
    status: 1,
    orders_crawling: false,
    from_register: false,
    tiki_update_product_email_sent: false,
    last_crawl_orders: 0,
    task_id: "7fbd0fee-55db-4e81-a9aa-a4b577febf83",
    enable_multi_warehouse: false,
    subscription_code: null,
    short_name: "Pura Dor Việt Nam Official",
    sync_quantity: true,
    sync_price: false,
    sendo_old: false,
  },
  {
    id: 143705,
    tenant_id: 69252,
    client_key: null,
    secret_key: null,
    access_token: null,
    refresh_token: null,
    name: "Pura Dor Viet Nam",
    logo: "",
    email: null,
    channel_type: 6,
    channel_identity: "7495604966600641194",
    initialized: true,
    craw_products_status: false,
    created_at: 1727069289,
    updated_at: 1728365908,
    token_expired_at: 1728970708,
    refresh_expired_at: 1742621272,
    expired_in: 0,
    status: 1,
    orders_crawling: false,
    from_register: false,
    tiki_update_product_email_sent: false,
    last_crawl_orders: 0,
    task_id: "e1c428e1-7b3d-4074-ac64-391ec09900ef",
    enable_multi_warehouse: true,
    subscription_code: null,
    short_name: "Pura Dor Viet Nam",
    sync_quantity: false,
    sync_price: false,
    sendo_old: false,
  },
  {
    id: 143860,
    tenant_id: 69252,
    client_key: null,
    secret_key: null,
    access_token: null,
    refresh_token: null,
    name: "Pura Dor Vietnam",
    logo: null,
    email: "ecom@sjgroup.vn",
    channel_type: 2,
    channel_identity: "200519968357",
    initialized: true,
    craw_products_status: false,
    created_at: 1727258397,
    updated_at: 1727597678,
    token_expired_at: 1729850397,
    refresh_expired_at: 1742810397,
    expired_in: 0,
    status: 1,
    orders_crawling: false,
    from_register: false,
    tiki_update_product_email_sent: false,
    last_crawl_orders: 0,
    task_id: "08ec6476-d175-4a7c-91ad-09327106aefc",
    enable_multi_warehouse: false,
    subscription_code: null,
    short_name: "Pura Dor Vietnam",
    sync_quantity: true,
    sync_price: false,
    sendo_old: false,
  },
];

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const marketplaceIds = searchParams.get("marketplaceIds");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const connection = await fetchDeliveryServicesProviders({
    marketplaceIds,
    from,
    to,
  });
  const response = await fetchOverviewChannel({ marketplaceIds, from, to });

  const mergedArray = response.map((item) => {
    const matchingChannel = dataChannels.find(
      (channel) => channel.id === item.connection_id
    );
    return {
      ...item,
      ...matchingChannel,
    };
  });

  console.log({ connection, mergedArray });
  
  return NextResponse.json(mergedArray);
}
