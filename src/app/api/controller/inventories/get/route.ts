import { NextResponse, NextRequest } from "next/server";
import { fetchData, standardizeBackendResponse } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import { adminHeadersList, BACKEND_ENDPOINT } from "@/lib/constants";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?endpoint=", "");

  let response = await fetchData<BackendDataResponse>(
    `${BACKEND_ENDPOINT}${path}`,
    {
      method: "GET",
      headers: adminHeadersList
    }
  );

  return NextResponse.json(standardizeBackendResponse(response));
}
