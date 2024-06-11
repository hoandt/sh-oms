import { fetchBrandsInventorySapo } from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?params=?productId=", "");

  const response = await fetchBrandsInventorySapo(path);
  return NextResponse.json(response);
}
