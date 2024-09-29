import { fetchOutboundDetailSapo } from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id") || "";
  const response = await fetchOutboundDetailSapo(id);

  return NextResponse.json(response);
}
