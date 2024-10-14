import { fetchData, standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";
import { fetchDashboard } from "../../services/dashboard";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const organization = urlPath.replace("?organization=", "");
  const data = await fetchDashboard();
  const response = data.replace("result", "");
  //parse JSON
  const parsedResponse = JSON.parse(response) as any[];
  //filter data organization

  const filteredData = parsedResponse.filter(
    (item) => item.organization_id == organization
  );

  return NextResponse.json(filteredData);
}
