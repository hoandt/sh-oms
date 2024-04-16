import { postLogs } from "@/app/api/services/logs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const logData = await req.json();

    console.log({ logData });
    return NextResponse.json(
      { message: "Successfully", data: logData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
