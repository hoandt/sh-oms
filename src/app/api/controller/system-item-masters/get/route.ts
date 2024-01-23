import { getSystemItemMaster } from "@/app/api/services/system-item-masters";
import { standardizeBackendResponse } from "@/lib/helpers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const options = searchParams.get("options") || {};
  const response = await getSystemItemMaster({ options });

  return NextResponse.json(response, { status: 200 });
}
