import { WMSLog } from "@/types/todo";
import { NextResponse, NextRequest } from "next/server";
import { toInteger } from "lodash";
import { updateLogs } from "../../services/logs";

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const LIMIT = 3; // number of allowed requests
const TIME_FRAME = 60000 * 4; // 4 minutes in milliseconds

export async function POST(req: NextRequest, res: NextResponse) {
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown"; // Get client's IP
  const currentTime = Date.now();

  // Rate limiting logic
  const rateLimitInfo = rateLimit.get(ip);
  if (rateLimitInfo) {
    const { count, timestamp } = rateLimitInfo;

    if (currentTime - timestamp < TIME_FRAME) {
      if (count >= LIMIT) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again later." },
          { status: 429 }
        );
      }
      rateLimit.set(ip, { count: count + 1, timestamp });
    } else {
      // Reset count and timestamp after the time frame
      rateLimit.set(ip, { count: 1, timestamp: currentTime });
    }
  } else {
    // First request from this IP
    rateLimit.set(ip, { count: 1, timestamp: currentTime });
  }

  // Proceed with your existing logic
  const logData = (await req.json()) as WMSLog;
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDIA_ENDPOINT}/download`,
    {
      method: "POST",
      body: JSON.stringify(logData),
      headers: headersList,
    }
  );

  const log = (await response.json()) as DownloadResponse;

  if (!log.success) {
    return NextResponse.json({ error: true });
  }

  const updatedHistory = logData.attributes.history
    ? logData.attributes.history
    : [];

  await updateLogs({
    id: toInteger(logData.id),
    videoUrl: log.data.videoUrl,
    history: [
      ...updatedHistory,
      {
        status: "downloaded",
        message: log.data.videoUrl,
      },
    ],
    status: "downloaded",
  });

  return NextResponse.json({ url: log.data.videoUrl });
}

type DownloadResponse = {
  success: boolean;
  data: {
    videoUrl: string;
    message: string;
  };
};
