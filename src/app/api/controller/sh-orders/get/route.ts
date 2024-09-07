import { SH_BACKEND_ENDPOINT, swifthubAdminHeadersList } from "@/lib/config";
import { fetchData, standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?endpoint=", "");

  let response = await fetchData<BackendDataResponse>(
    `${SH_BACKEND_ENDPOINT}${path}`,
    {
      method: "GET",
      headers: swifthubAdminHeadersList,
    }
  );

  return NextResponse.json(standardizeBackendResponse(response));
}
