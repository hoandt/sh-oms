import { NextResponse, NextRequest } from "next/server";
import { updateLogs } from "@/app/api/services/logs";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const cloudinaryReq = (await req.json()) as CloudinaryRequest;
    if (cloudinaryReq.notification_type === "upload") {
      // const public_id = ${logData.id}_${transaction}
      const id = cloudinaryReq.public_id.split("_")[0];
      const response = await updateLogs({
        id: parseInt(id),
        videoUrl: cloudinaryReq.secure_url,
        history: {
          disputed: true,
          originalUrl: cloudinaryReq.url,
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

const cloudinaryRequest = {
  notification_type: "upload",
  timestamp: "2024-04-16T15:35:30+00:00",
  request_id: "60fe32cb9ce1432f7b0f99edb9a6171a",
  asset_id: "95fdeb678fd592f6c5e8c1fd9236394a",
  public_id: "kwavn0vtr1bkct3oxpew",
  version: 1713281593,
  version_id: "9631043c5e6e4dcb1b4f2ee4cb32ba59",
  width: 640,
  height: 480,
  format: "webm",
  resource_type: "video",
  created_at: "2024-04-16T15:33:13Z",
  tags: [],
  pages: 0,
  bytes: 2882183,
  type: "upload",
  etag: "9bca817e1c2df0a73c2edc0a55276e9b",
  placeholder: false,
  url: "http://res.cloudinary.com/dfo55d4yi/video/upload/v1713281593/kwavn0vtr1bkct3oxpew.webm",
  secure_url:
    "https://res.cloudinary.com/dfo55d4yi/video/upload/v1713281593/kwavn0vtr1bkct3oxpew.webm",
  playback_url:
    "https://res.cloudinary.com/dfo55d4yi/video/upload/sp_auto/v1713281593/kwavn0vtr1bkct3oxpew.m3u8",
  folder: "",
  audio: {},
  video: {
    pix_format: "yuv420p",
    codec: "vp9",
    level: -99,
    profile: "Profile 0",
    dar: "4:3",
    time_base: "1/1000",
  },
  frame_rate: 60,
  bit_rate: 275421,
  duration: 83.717,
  rotation: 0,
  original_filename: "uqid-1713269035059_3288808768",
  api_key: "835479918789953",
  notification_context: {
    triggered_at: "2024-04-16T15:33:08.689116Z",
    triggered_by: [Object],
  },
  signature_key: "835479918789953",
};

type CloudinaryRequest = typeof cloudinaryRequest;
