import { WMSLog } from "@/types/todo";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const logData = (await req.json()) as WMSLog;
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDIA_ENDPOINT}/preview`,
    {
      method: "POST",
      body: JSON.stringify(logData),
      headers: headersList,
    }
  );
  const log = (await response.json()) as DownloadResponse;

  if (!log.success) {
    return NextResponse.json({ log });
  }

  return NextResponse.json({ log });
}
type DownloadResponse = {
  success: boolean;
  data: {
    videoUrl: string;
    message: string;
  };
};
