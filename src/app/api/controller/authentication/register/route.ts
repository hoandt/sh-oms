import { postUser } from "@/app/api/services/user";
import { RegisterTenant } from "@/types/authen";
import { AxiosResponse } from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const authenData = (await req.json()) as RegisterTenant;
    const response = (await postUser({ data: authenData })) as AxiosResponse;

    if (response.status !== 200) {
      return NextResponse.json(
        { message: "Failed", response: (response as any).error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Successfully", response: response.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
