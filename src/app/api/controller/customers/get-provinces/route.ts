import { getProvinces } from "@/app/api/services/customers";
import { standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?options=", "");
  const response = await getProvinces({ options: path });
  return NextResponse.json(response);
}
