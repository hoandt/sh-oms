import { createWriteStream, mkdirSync, unlink } from "fs";
import { join } from "path";
import { promisify } from "util";
import ApiVideoClient from "@api.video/nodejs-client";
import { NextRequest } from "next/server";
const DEFAULT_UPLOAD_TOKEN = process.env.DEFAULT_UPLOAD_TOKEN;
const writeFileAsync = promisify(createWriteStream);

export async function POST(request: NextRequest): Promise<Response> {
  const formData = await request.formData();

  const blob = formData.get("chunk") as Blob;
  const filename = formData.get("filename") as string;

  const buffer = await blob.arrayBuffer();

  // create a directory for the videos by filename, force the creation of the directory if it does not exist

  mkdirSync(join(process.cwd(), "uploads", filename), { recursive: true });
  // Save the buffer data to a file on the server in chunks

  const filePath = join(
    process.cwd(),
    `uploads/${filename}`,
    filename + ".webm"
  );
  // write stream

  const writeStream = createWriteStream(filePath, {
    flags: "a",
  });
  const chunkSize = 1024 * 1024 * 5; // 5MB chunk size
  let offset = 0;

  while (offset < buffer.byteLength) {
    const chunk = buffer.slice(offset, offset + chunkSize);
    writeStream.write(Buffer.from(chunk));
    offset += chunkSize;
  }

  writeStream.end();

  // create a directory for the videos by filename

  // // Initialize the api.video client
  // const client = new ApiVideoClient({
  //   apiKey: "71fUVaLBW3yDQnF7YLIseryMmirNwVwbMqiemy7uiav",
  // });

  // // Create a video entry
  // const videoCreationPayload = {
  //   title: filename, // The title of your new video.
  //   description: "A video about string theory.", // A brief description of your video.
  // };

  // const video = await client.videos.create(videoCreationPayload);

  // // Upload the video file
  // const videoSource = await client.videos.upload(video.videoId, filePath);

  // // Delete the local file after upload
  // unlink(filePath, (err) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log("File deleted");
  // });

  // Return a success response
  return new Response("videoSource.assets?.mp4", {
    status: 200,
  });
}
