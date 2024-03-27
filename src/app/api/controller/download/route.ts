import { WMSLog } from "@/types/todo";
import { NextResponse, NextRequest } from "next/server";
const cloudinary = require("cloudinary").v2;

export async function POST(req: NextRequest, res: NextResponse) {
  const logData = (await req.json()) as WMSLog;

  const sampleLogData = {
    logData: {
      id: 1467,
      attributes: {
        createdAt: "2024-03-27T14:58:49.843Z",
        transaction: "eww",
        type: "return",
        updatedAt: "2024-03-27T14:59:11.570Z",
        user: 4,
        status: "packed",
        history: null,
        videoUrl:
          "http://res.cloudinary.com/djdygww0g/video/upload/v1711551549/eww.webm",
      },
    },
  };

  //   extract videoname from videoUrl
  const transaction = logData.attributes.transaction;
  const user = logData.attributes.user;
  const videoName = logData.attributes.videoUrl.split("/").pop();
  const type = logData.attributes.type;
  // datetime   createdAt dd/mm/yyyy hh:mm (27/03/2024 14:58)
  const createdDate = new Date(logData.attributes.createdAt);
  const fcreatedDate = `${createdDate.getDate()}/${createdDate.getMonth()}/${createdDate.getFullYear()}`;

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
            font_weight: "bold",
            letter_spacing: 3,
            text: `${transaction}\n${fcreatedDate}\n${user}`,
          },
        },
        { flags: "layer_apply", gravity: "north_west", x: 21, y: 21 },
        {
          color: "#FFFFFF",
          overlay: {
            font_family: "Arial",
            font_size: 35,
            font_weight: "bold",
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
            font_weight: "bold",
            letter_spacing: 3,
            text: `${type}`,
          },
        },
        { flags: "layer_apply", gravity: "south_west", x: 21, y: 21 },
        {
          color: "#FFFFFF",
          overlay: {
            font_family: "Arial",
            font_size: 35,
            font_weight: "bold",
            letter_spacing: 3,
            text: `${type}`,
          },
        },
        { flags: "layer_apply", gravity: "south_west", x: 19, y: 19 },

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

  return NextResponse.json(url);
}
