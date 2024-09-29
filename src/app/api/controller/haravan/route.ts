import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
const base_url = "https://apis.haravan.com/com";
const token = {
  rebn: "9F93B342AC34E4B0AB7513BC00C1319562DBDC67DAC98ED41C8D121804585E73",
  lamthao: "4142598ED9B2F0AB4B6D3DA85C2D44D4AF6CF3EFA7B20A840C7C00A0EFC4C8A0",
};

export async function GET(request: NextRequest) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token.lamthao}`,
  };
  const endpoint = `${base_url}/orders.json`;

  //params {ids,limit,page,since_id,created_at_min,created_at_max,updated_at_min,updated_at_max,processed_at_min,processed_at_max,financial_status,fulfillment_status,status,fields,order,}
  const params = request.nextUrl.searchParams;
  const ids = params.get("ids");
  const limit = params.get("limit");
  const page = params.get("page");
  const since_id = params.get("since_id");
  const created_at_min = params.get("created_at_min");
  const created_at_max = params.get("created_at_max");
  const updated_at_min = params.get("updated_at_min");
  const updated_at_max = params.get("updated_at_max");
  const processed_at_min = params.get("processed_at_min");
  const processed_at_max = params.get("processed_at_max");
  const financial_status = params.get("financial_status");
  const fulfillment_status = params.get("fulfillment_status");
  const status = params.get("status");
  const fields = params.get("fields");
  const order = params.get("order");

  const urlParams = new URLSearchParams();
  if (ids) urlParams.append("ids", ids);
  if (limit) urlParams.append("limit", limit);
  if (page) urlParams.append("page", page);
  if (since_id) urlParams.append("since_id", since_id);
  if (created_at_min) urlParams.append("created_at_min", created_at_min);
  if (created_at_max) urlParams.append("created_at_max", created_at_max);
  if (updated_at_min) urlParams.append("updated_at_min", updated_at_min);
  if (updated_at_max) urlParams.append("updated_at_max", updated_at_max);
  if (processed_at_min) urlParams.append("processed_at_min", processed_at_min);
  if (processed_at_max) urlParams.append("processed_at_max", processed_at_max);
  if (financial_status) urlParams.append("financial_status", financial_status);
  if (fulfillment_status)
    urlParams.append("fulfillment_status", fulfillment_status);
  if (status) urlParams.append("status", status);
  if (fields) urlParams.append("fields", fields);
  if (order) urlParams.append("order", order);

  const res = await axios.get(`${endpoint}?${urlParams}`, {
    headers,
  });
  const orders = res.data;

  return NextResponse.json(orders);
}
