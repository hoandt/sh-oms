import { postUser } from "@/app/api/services/user";
import { RegisterTenant } from "@/types/authen";
import { AxiosResponse } from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  //validate the captcha
  const authenData = (await req.json()) as RegisterTenant;

  //extract the captcha token
  const captchaToken = authenData.captcha;
  const isCaptchaValid = await validateCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return NextResponse.json(
      { message: "Failed", response: isCaptchaValid },
      { status: 400 }
    );
  }

  try {
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

//validate the captcha function

const validateCaptcha = async (captchaToken: string) => {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=6LcIIUAqAAAAAIeF3C4TaIOpMdwKxFWqt-ltZlkD
&response=${captchaToken}`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data.success;
};
