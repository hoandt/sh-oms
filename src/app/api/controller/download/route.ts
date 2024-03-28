import { WMSLog } from "@/types/todo";
import { NextResponse, NextRequest } from "next/server";
import { unlink } from "node:fs";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest, res: NextResponse) {
  cloudinary.config({
    cloud_name: "dfo55d4yi",
    api_key: "835479918789953",
    api_secret: "gK7AezRTS4T4Y-R7FRX0BTCOZzA",
    secure: true,
  });
  const logData = (await req.json()) as WMSLog;
  // const url = await getCloudinaryVideo(logData);
  const url = await uploadVideoRemoteURL(
    "https://vod.api.video/vod/vi1ozzvYMKyf2C1NUjvH57D2/mp4/source.mp4"
  );
  console.log({ url });
  return NextResponse.json({ url });
}

const getCloudinaryVideo = async (logData: WMSLog) => {
  //   extract videoname from videoUrl
  const transaction = logData.attributes.transaction;
  const user = logData.attributes.user;
  const videoName = logData.attributes.videoUrl.split("/").pop()!;
  const type = logData.attributes.type;
  // datetime   createdAt dd/mm/yyyy hh:mm (27/03/2024 14:58)
  const createdDate = new Date(logData.attributes.createdAt);
  // date with leading zero
  const leadingZeroDate = (date: number) => {
    return date < 10 ? `0${date}` : date;
  };

  const fcreatedDate = `${leadingZeroDate(
    createdDate.getDate()
  )}/${leadingZeroDate(createdDate.getMonth())}/${createdDate.getFullYear()}`;
  const url = cloudinary
    .video(videoName, {
      fetch_format: "mp4",
      transformation: [
        { height: 720, crop: "scale" },
        {
          color: "#000000",
          overlay: {
            font_family: "Arial",
            font_size: 35,

            letter_spacing: 3,
            text: `${transaction}\n${fcreatedDate}\n${user}`,
          },
        },
        { flags: "layer_apply", gravity: "north_west", x: 20, y: 20 },
        {
          color: "#FFFFFF",
          overlay: {
            font_family: "Arial",
            font_size: 35,

            letter_spacing: 3,
            text: `${transaction}\n${fcreatedDate}\n${user}`,
          },
        },
        { flags: "layer_apply", gravity: "north_west", x: 19, y: 19 },
        {
          color: "#000000",
          overlay: {
            font_family: "Arial",
            font_size: 35,
            letter_spacing: 3,
            text: `${type}`,
          },
        },
        { flags: "layer_apply", gravity: "south_west", x: 19, y: 22 },
        {
          color: "#FFFFFF",
          overlay: {
            font_family: "Arial",
            font_size: 35,
            letter_spacing: 3,
            text: `${type}`,
          },
        },
        { flags: "layer_apply", gravity: "south_west", x: 21, y: 21 },

        //   {
        //     overlay: {
        //       url: "https://i.pinimg.com/originals/f3/e9/9a/f3e99af7b109ab63d0d1d326bbfa6b45.gif",
        //     },
        //   },
        //   { flags: "layer_apply", gravity: "north_east" },
      ],
    })
    .split("src='")
    .pop()!
    .split("'")[0];
  return url;
};

const uploadVideoRemoteURL = async (url: string) => {
  const data = cloudinary.uploader.upload(url).then((result) => result);
  return data;
};
