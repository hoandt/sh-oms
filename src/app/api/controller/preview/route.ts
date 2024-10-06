import { WMSLog } from "@/types/todo";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const logData = (await req.json()) as WMSLog;
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  //videoUrl
  const videoUrl = logData.attributes.videoUrl;

  if (!videoUrl || videoUrl === "" || videoUrl === "LOCAL") {
    const log = {
      success: false,
      videoUrl: videoUrl,
      message: "",
    };
    return NextResponse.json({
      log,
    });
  }

  const videoResponse = await fetch(videoUrl);

  if (videoResponse.status !== 404) {
    const log = {
      success: true,
      videoUrl: videoUrl,
      message: videoUrl,
    };
    return NextResponse.json({
      log,
    });
  } else {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_ENDPOINT}/preview`,
      {
        method: "POST",
        body: JSON.stringify(logData),
        headers: headersList,
      }
    );
    const log = (await response.json()) as DownloadResponse;

    return NextResponse.json({ log });
  }
}
type DownloadResponse = {
  success: boolean;
  data: {
    videoUrl: string;
    message: string;
  };
};
