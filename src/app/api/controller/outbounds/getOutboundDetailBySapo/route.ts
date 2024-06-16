import { fetchOutboundDetailSapo } from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const productId = searchParams.get("productId") || '';
  const response = await fetchOutboundDetailSapo(productId);
  return NextResponse.json(response);
}
