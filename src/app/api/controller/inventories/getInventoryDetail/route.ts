import { fetchInventorySapo } from "@/app/api/services/sapo";
import { standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?params=?productId=", "");

  const response = await fetchInventorySapo(path);
  return NextResponse.json(response);
}
