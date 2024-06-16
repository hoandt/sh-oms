import { fetchInboundDetailSapo } from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const inboundId = searchParams.get("inboundId") || "";

  const response = await fetchInboundDetailSapo(inboundId);
  return NextResponse.json(response);
}
