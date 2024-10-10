import React, { useEffect, useState } from "react";
import { useGetOutboundDetailBySapo } from "@/query-keys/outbound";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Composite from "../../picking/components/Composite";
import { WMSLog, WMSPromotion } from "@/types/todo";
import { useSession } from "next-auth/react";
import { getPromotions } from "@/services/getPromotions";
const orderIdScan = z.object({
  orderID: z
    .string({ required_error: "Vui lòng nhập mã đơn nhập" })
    .min(1, { message: "Vui lòng nhập mã đơn nhập" }),
});

const PackingInstruction = ({ barcode }: { barcode: string }) => {
  //   const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { data } = useGetOutboundDetailBySapo({
    id: barcode,
  });

  //   no data return null
  if (!data) {
    return null;
  }
  const [promotions, setPromotions] = useState<WMSPromotion[]>([]);
  const [prevOrgId, setPrevOrgId] = useState("");
  const session = useSession() as any;
  const [currentUser, setCurrentUser] = useState<UserWithRole>();
  useEffect(() => {
    if (session.data) {
      const user = session.data.userWithRole as UserWithRole;
      setCurrentUser(user);

      // Check if the organization ID has changed
      if (prevOrgId !== user.organization.id.toString()) {
        setPrevOrgId(user.organization.id.toString()); // Update the previous organization ID

        getPromotions({
          organization: user.organization.id.toString(),
        }).then((data) => {
          setPromotions(data.data[0].attributes.promotion);
        });
      }
    }
  }, [session, prevOrgId]);

  return (
    <div
      className={data?.order.status === "cancelled" ? "bg-red-50" : "bg-white"}
    >
      <div className="mt-2">
        <div>
          <div>Order ID: {data?.order.reference_number}</div>
          <div>Channel: {data?.order.channel}</div>
          <div>
            Status:
            {/* red if cancelled */}
            {data?.order.status === "cancelled" ? (
              <span className="mx-2 text-red-500 bg-red-50 px-2">
                {data?.order.status}
              </span>
            ) : (
              <span>{data?.order.status}</span>
            )}
          </div>
        </div>
        <div>
          {/* check order fulfillment */}
          <div>
            <div>
              {/* red if not fulfilled */}
              {data?.order.fulfillments.length ? (
                <span className=" text-green-500 bg-green-50  text-lg">
                  {/* get service_name in fulfillment */}
                  {data?.order.fulfillments[0].shipment.service_name} -{" "}
                  {data?.order.fulfillments[0].shipment.tracking_code}
                </span>
              ) : (
                <span className=" text-red-500 bg-red-50 px-2"></span>
              )}
            </div>
          </div>
        </div>
      </div>
      {data?.order.order_line_items.map((item) => {
        //check if item.sku is in promotions
        const isPromotion = promotions.find(
          (promotion) => promotion.sku === item.sku
        );

        return (
          <div>
            {item.composite_item_domains.length ? (
              <Composite compositeDomains={item.composite_item_domains} />
            ) : (
              <div className="border rounded bg-slate-50">
                {/* display name, sku, barcode, qty to pick (style table) */}
                <div className="flex  gap-2 items-center p-2">
                  <div className="font-bold text-2xl bg-white px-2 ">
                    {item.quantity}
                  </div>
                  <div>
                    {item.product_name}

                    <div>
                      {item.sku} | Barcode: {item.barcode}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isPromotion && (
              <div className="bg-blue-200 text-blue-700 p-3 flex gap-2">
                {/* add pulsing effect */}
                <span className="animate-pulse px-2 font-bold bg-yellow-300 text-yellow-700 rounded-sm">
                  PROMOTION
                </span>
                {isPromotion.sku} tặng {isPromotion.promotion}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PackingInstruction;
