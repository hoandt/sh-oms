import { fetchInventoriesSapo } from "@/app/api/services/sapo";
import { standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?params=", "");

  const response = await fetchInventoriesSapo(path);
  return NextResponse.json(response);
}
