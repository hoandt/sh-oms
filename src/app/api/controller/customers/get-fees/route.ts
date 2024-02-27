import {
  getGHNMethodGetFee,
  getGHTKMethod,
  getVNPostMethod,
} from "@/app/api/services/deliveries";
import { METHOD_DELIVERY } from "@/lib/config";
import { DataResponseDeliveryMethod } from "@/types/customer";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const responseData = await req.json();

  const payloadGHN = responseData.find(
    (e: any) => e.name === METHOD_DELIVERY.GHN
  ).payload;
  const payloadGHTK = responseData.find(
    (e: any) => e.name === METHOD_DELIVERY.GHTK
  ).payload;
  const payloadVNPost = responseData.find(
    (e: any) => e.name === METHOD_DELIVERY.VNP
  ).payload;

  const responseGHN = await getGHNMethodGetFee({ payload: payloadGHN });
  const responseGHTK = await getGHTKMethod({ payload: payloadGHTK });
  const responseVNPost = await getVNPostMethod({ payload: payloadVNPost });

  // console.log({ responseVNPost });

  const response: DataResponseDeliveryMethod[] = [
    {
      name: "Giao hàng nhanh",
      total_fee: responseGHN?.data.total || 0,
      duration: "1-2 ngày",
    },
    {
      name: "Giao hàng tiết kiệm",
      total_fee: responseGHTK?.fee.fee || 0,
      duration: "1-3 ngày",
    },
    {
      name: "Giao hàng VNPost tiết kiệm",
      total_fee: responseVNPost?.[0].totalFee || 0,
      duration: "2-3 ngày",
    },
  ];

  return NextResponse.json(response);
}
