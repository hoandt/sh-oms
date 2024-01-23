import { getWards } from "@/app/api/services/customers";
import { QueryOptions } from "@/types/common";
import { NextResponse, NextRequest } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?options=", "");
  const response = await getWards({ options: path });
  return NextResponse.json(response);
}
