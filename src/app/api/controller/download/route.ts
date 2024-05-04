import { WMSLog } from "@/types/todo";
import { NextResponse, NextRequest } from "next/server";
// import { unlink } from "node:fs";
// import { v2 as cloudinary } from "cloudinary";
import { toInteger } from "lodash";
import { updateLogs } from "../../services/logs";

// cloudinary.config({
//   cloud_name: "dfo55d4yi",
//   api_key: "835479918789953",
//   api_secret: "gK7AezRTS4T4Y-R7FRX0BTCOZzA",
//   secure: true,
// });
export async function POST(req: NextRequest, res: NextResponse) {
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

  await updateLogs({
    id: toInteger(logData.id),
    videoUrl: log.data.videoUrl,
    history: {
      disputed: true,
      originalUrl: logData.attributes.videoUrl,
    },
  });

  return NextResponse.json({ url: log.data.videoUrl });
}
// async function POSTLegacy(req: NextRequest, res: NextResponse) {
//   const logData = (await req.json()) as WMSLog;
//   // const url = await getCloudinaryVideo(logData);
//   const url = await uploadVideoRemoteURL(logData);
//   if (!url) {
//     return NextResponse.error();
//   }
//   const resUpdateTransaction = await updateLogs({
//     id: toInteger(logData.id),
//     videoUrl: url.secure_url,
//     history: {
//       disputed: true,
//       originalUrl: logData.attributes.videoUrl,
//     },
//   });
//   console.log(resUpdateTransaction);
//   return NextResponse.json({ url: url.secure_url });
// }

// const uploadVideoRemoteURL = async (logData: WMSLog) => {
//   const url = logData.attributes.videoUrl;
//   if (!url) {
//     return;
//   }
//   const transaction = logData.attributes.transaction;
//   const user = logData.attributes.user;
//   const type = logData.attributes.type;
//   // datetime   createdAt dd/mm/yyyy hh:mm (27/03/2024 14:58)
//   const createdDate = new Date(logData.attributes.createdAt);
//   // date with leading zero
//   const leadingZeroDate = (date: number) => {
//     return date < 10 ? `0${date}` : date;
//   };

//   const fcreatedDate = `${leadingZeroDate(
//     createdDate.getDate()
//   )}.${leadingZeroDate(
//     createdDate.getMonth() + 1
//   )}.${createdDate.getFullYear()}`;

//   const data = cloudinary.uploader
//     .upload(url, {
//       resource_type: "video",
//       use_filename: true,
//       filename_override: `${logData.id}_${transaction}`,
//       public_id: `${logData.id}_${transaction}`,
//       transformation: [
//         {
//           color: "#000000",
//           overlay: {
//             font_family: "Arial",
//             font_size: 26,
//             font_weight: "bold",
//             letter_spacing: 2,
//             text: `${transaction}\n${fcreatedDate}\n${user} - ${type}`,
//           },
//         },
//         { flags: "layer_apply", gravity: "north_west", x: 20, y: 20 },
//         {
//           color: "#FFFFFF",
//           overlay: {
//             font_family: "Arial",
//             font_size: 26,
//             font_weight: "bold",
//             letter_spacing: 2,
//             text: `${transaction}\n${fcreatedDate}\n${user} - ${type}`,
//           },
//         },
//         { flags: "layer_apply", gravity: "north_west", x: 19, y: 19 },

//         //   {
//         //     overlay: {
//         //       url: "https://i.pinimg.com/originals/f3/e9/9a/f3e99af7b109ab63d0d1d326bbfa6b45.gif",
//         //     },
//         //   },
//         //   { flags: "layer_apply", gravity: "north_east" },
//       ],
//     })
//     .then((result) => result);
//   return data;
// };

type DownloadResponse = {
  success: boolean;
  data: {
    videoUrl: string;
    message: string;
  };
};
