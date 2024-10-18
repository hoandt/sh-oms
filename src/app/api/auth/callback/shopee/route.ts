import { NextResponse, NextRequest } from "next/server";
import { redirect } from "next/navigation";

import axios, { isAxiosError } from "axios";
import crypto from "crypto";
import { adminHeadersList } from "@/lib/config";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
const host = "https://partner.test-stable.shopeemobile.com";
// Main execution
const partnerId = 1213137; // Your partner ID
const partnerKey =
  "56436179764c5544574a5769486544515362704d67725165526461444f7a4b49"; // Your partner key
let headersList = {
  Accept: "*/*",
  Authorization:
    "Bearer 41520a2d2347c5ad3fe079502c4fcffec875ac846878709a921adb0d2af96080cd446188b00d14a3ab0db77f281b278126f1c90aba808475a1eceaf9514e56d73fcf6f766a4cce26cab71218ce233ea2e1ea41960862dedc6e9c444092fefa3559e34e9b2f5f7bd0dd013dbfce01cbae9c06d25db8489b591f2a64d385780a26",
  "Content-Type": "application/json",
};

export async function GET(request: NextRequest, response: NextResponse) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const shop_id = params.get("shop_id");
  const session =
    ((await getServerSession(
      request as unknown as NextApiRequest,
      {
        ...response,
        getHeader: (name: string) => response.headers?.get(name),
        setHeader: (name: string, value: string) =>
          response.headers?.set(name, value),
      } as unknown as NextApiResponse,
      auth
    )) as UserSession) || null;

  const currentUser = session.userWithRole;
  const organization = currentUser.organization.id;

  // code or shop_id is required
  if (!code || !shop_id) {
    return NextResponse.json({
      ok: false,
      message: "code or shop_id is required",
    });
  }
  // Get access token

  try {
    const tokenResponse = await getTokenShopLevel(
      code,
      partnerId,
      partnerKey,
      Number(shop_id)
    );

    const { access_token, refresh_token, expire_in } = tokenResponse;
    //get current user session nextAuth

    const storePayload = {
      organization,
      saleChannel: "shopee",
      shop_id: shop_id,
      access_token: access_token!,
      refresh_token: refresh_token!,
      expire_in: expire_in!,
    };
    const log = await createStore(storePayload);

    return NextResponse.redirect(new URL("/marketplaces", request.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/marketplaces", request.url));
  }
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expire_in?: number;
  request_id?: string;
  error?: string;
  message?: string;
}

async function getTokenShopLevel(
  code: string,
  partnerId: number,
  partnerKey: string,
  shopId: number
): Promise<TokenResponse> {
  const path = "/api/v2/auth/token/get";
  const timest = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  shopId = Number(shopId); // Cast shopId to a number

  const body = {
    code: code,
    shop_id: shopId,
    partner_id: partnerId,
  };

  const baseString = `${partnerId}${path}${timest}`;
  const sign = crypto
    .createHmac("sha256", partnerKey)
    .update(baseString)
    .digest("hex");
  const url = `${host}${path}?partner_id=${partnerId}&timestamp=${timest}&sign=${sign}`;

  try {
    const response = await axios.post<TokenResponse>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

let bodyContent = JSON.stringify({
  organization: 313,
  saleChannel: "shopee",
  shop_id: "222",
  access_token: "a",
  refresh_token: "b",
  expire_in: 123123,
});

let reqOptions = {
  url: "https://be-cam.swifthub.net/api/system-stores",
  method: "POST",
  headers: headersList,
  data: bodyContent,
};

type StorePayload = {
  organization: number;
  saleChannel: string;
  shop_id: string;
  access_token: string;
  refresh_token: string;
  expire_in: number;
};
const createStore = async (payload: StorePayload) => {
  const bodyContent = JSON.stringify({
    data: payload,
  });

  try {
    const response = await axios.post(
      "https://be-cam.swifthub.net/api/system-stores",
      bodyContent,
      {
        headers: adminHeadersList,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
