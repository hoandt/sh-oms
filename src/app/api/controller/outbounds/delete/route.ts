import { NextResponse, NextRequest } from "next/server";
import { updateInbound } from "@/app/api/services/inbounds";
import { deleteOutbound } from "@/app/api/services/outbounds";

export async function DELETE(req: NextRequest, res: NextResponse) {

  try {
    const outboundData = (await req.json()) as {id: number};

    console.log({outboundData})

    const response = await deleteOutbound(outboundData);
  
    return NextResponse.json({ message: "Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
