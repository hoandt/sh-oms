import { fetchInboundsSapo } from "@/app/api/services/sapo";
import auth from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const path = urlPath.replace("?params=", "");
  const session = (await getServerSession(auth)) as any;
  const currentUser = session.userWithRole as UserWithRole;
  const sellerId = currentUser.organization.legalRep;
  const response = await fetchInboundsSapo(path, sellerId);
  return NextResponse.json(response);
}
