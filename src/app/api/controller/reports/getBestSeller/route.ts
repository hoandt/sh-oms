import { fetchBestSellerProducts } from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const marketplaceIds = searchParams.get("marketplaceIds");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const response = await fetchBestSellerProducts({ marketplaceIds, from, to });
  return NextResponse.json(response);
}
