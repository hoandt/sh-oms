import { deleteLogs } from "@/app/api/services/logs";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const outboundData = (await req.json()) as { id: number };

    const response = await deleteLogs(outboundData);

    return NextResponse.json(
      { message: "Successfully", data: response?.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
