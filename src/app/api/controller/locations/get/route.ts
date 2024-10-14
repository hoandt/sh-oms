import { fetchDashboard } from "@/app/api/services/dashboard";
import { fetchData, standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?org=", "");

  const data = await fetchDashboard();

  return NextResponse.json({ urlPath, data });
}
