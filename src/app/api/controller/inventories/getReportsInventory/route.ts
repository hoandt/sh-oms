import { fetchInventorySapo, fetchReportInventorySapo } from "@/app/api/services/sapo";
import { standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
//   const urlPath = req.nextUrl.search;
  const { searchParams } = req.nextUrl;
  console.log({first:  req.nextUrl.search})
  const variantId = searchParams.get("variantId");
  const page = searchParams.get("page");
  const limit = searchParams.get("pageSize");
  const locationId = searchParams.get("locationId");
  const path = `${variantId}.json?page=${page}&limit=${limit}&location_ids=${locationId}`
  console.log({path})
  const response = await fetchReportInventorySapo(path);
  return NextResponse.json(response);
}
