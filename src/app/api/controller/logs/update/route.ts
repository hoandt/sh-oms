import { updateLogs } from "@/app/api/services/logs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const logData = (await req.json()) as {
      id: number;
      videoUrl: string;
      status: string;
    };

    const response = await updateLogs(logData);

    return NextResponse.json(
      { message: "Successfully", data: response?.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
