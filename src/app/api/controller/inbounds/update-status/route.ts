import { NextResponse, NextRequest } from "next/server";
import { updateInbound } from "@/app/api/services/inbounds";

export async function POST(req: NextRequest, res: NextResponse) {

  try {
    const inboundData = (await req.json()) as {id: number; inbound: any};

    const response = await updateInbound(inboundData);
  
    return NextResponse.json({ message: "Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
