import { fetchReportInventorySapo } from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const variantId = searchParams.get("variantId");
  const page = searchParams.get("page");
  const limit = searchParams.get("pageSize");
  const locationId = searchParams.get("locationId");
  const path = `${variantId}.json?page=${page}&limit=${limit}&location_ids=${locationId}`;
  
  const response = await fetchReportInventorySapo(path);
  return NextResponse.json(response);
}
