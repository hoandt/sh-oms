import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(req: NextRequest, res: NextResponse) {
  const urlPath = req.nextUrl.search;
  const subcriberId = urlPath.replace("?subscription=", "");

  try {
    const response = await fetch(`https://tracking.swifthub.net/report.txt`, {
      cache: "no-store",
    });
    const data = await response.text();
    const obj = subscriptionData(data);

    return NextResponse.json({ txt: Number.parseInt(obj[subcriberId]) || -1 });
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({ txt: -1 });
}

//convert raw text to object
const subscriptionData = (text: string) => {
  const obj = {} as any;
  text.split("\n").forEach((line) => {
    // remove empty lines
    if (line.trim() === "") return;
    const [key, value] = line.split(":");
    obj[key] = value;
  });
  return obj;
};
