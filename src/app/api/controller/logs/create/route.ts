import { updateInbound } from "@/app/api/services/inbounds";
import { postLogs } from "@/app/api/services/logs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const logData = await req.json();
    const response = await postLogs({ logs: logData });

    // console.log({response})
    return NextResponse.json(
      { message: "Successfully", data: response?.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
