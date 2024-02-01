import auth from "@/auth";
import { adminHeadersList, BACKEND_ENDPOINT } from "@/lib/config";
import { fetchData, standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?endpoint=", "");

  let response = await fetchData<BackendDataResponse>(
    `${BACKEND_ENDPOINT}${path}`,
    {
      method: "GET",
      headers: adminHeadersList,
    }
  );

  return NextResponse.json(standardizeBackendResponse(response));
}
