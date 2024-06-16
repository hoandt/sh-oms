import { fetchLocationSapo } from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const response = await fetchLocationSapo();
  return NextResponse.json(response);
}
