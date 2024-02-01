import { getCustomer, getDistricts } from "@/app/api/services/customers";
import { getOrganization } from "@/app/api/services/organization";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?options=", "");
  const response = await getOrganization({ options: path });
  return NextResponse.json(response);
}
