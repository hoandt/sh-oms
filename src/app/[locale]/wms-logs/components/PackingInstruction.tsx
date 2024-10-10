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

const useUserWithPromotions = (prevOrgId: any) => {
  const session = useSession() as any;
  const [promotions, setPromotions] = useState<WMSPromotion[]>([]);
  const [currentUser, setCurrentUser] = useState<UserWithRole>();
  const [updatedOrgId, setUpdatedOrgId] = useState(prevOrgId);

  useEffect(() => {
    if (session.data) {
      const user = session.data.userWithRole as any;
      setCurrentUser(user);
      if (updatedOrgId !== user.organization.id.toString()) {
        setUpdatedOrgId(user.organization.id.toString());
        getPromotions({ organization: user.organization.id.toString() }).then(
          (data) => {
            if (data.data.length && data.data[0].attributes) {
              setPromotions(data.data[0].attributes.promotion);
            }
          }
        );
      }
    }
  }, [session, updatedOrgId]);

  return { currentUser, promotions };
};

const useOrderDetail = (barcode: string) => {
  const { data } = useGetOutboundDetailBySapo({ id: barcode });
  return data;
};

const PackingInstruction = ({ barcode }: { barcode: string }) => {
  const data = useOrderDetail(barcode);
  const { promotions, currentUser } = useUserWithPromotions("");

  if (!data) return null;

  return (
    <div
      className={data.order.status === "cancelled" ? "bg-red-50" : "bg-white"}
    >
      <div className="mt-2">
        <div>
          <div>Order ID: {data.order.reference_number}</div>
          <div>Channel: {data.order.channel}</div>
          <div>
            Status:{" "}
            {data.order.status === "cancelled" ? (
              <span className="mx-2 text-red-500 bg-red-50 px-2">
                {data.order.status}
              </span>
            ) : (
              <span>{data.order.status}</span>
            )}
          </div>
        </div>
        <div>
          <div>
            {data.order.fulfillments.length ? (
              <span className="text-green-500 bg-green-50 text-lg">
                {data.order.fulfillments[0].shipment.service_name} -{" "}
                {data.order.fulfillments[0].shipment.tracking_code}
              </span>
            ) : (
              <span className="text-red-500 bg-red-50 px-2">Not Fulfilled</span>
            )}
          </div>
        </div>
      </div>
      {data.order.order_line_items.map((item) => {
        const isPromotion = promotions.find(
          (promotion) => promotion.sku === item.sku
        );

        return (
          <div key={item.sku} className="border rounded bg-slate-50">
            {item.composite_item_domains.length ? (
              <Composite compositeDomains={item.composite_item_domains} />
            ) : (
              <div className="flex gap-2 items-center p-2">
                <div className="font-bold text-2xl bg-white px-2">
                  {item.quantity}
                </div>
                <div>
                  <div className="text-xs">{item.product_name}</div>
                  <div>
                    {item.sku} | Barcode: {item.barcode}
                  </div>
                </div>
              </div>
            )}
            {isPromotion && (
              <div className="bg-blue-200 text-blue-700 p-3 flex gap-2 animate-pulse">
                <span className="px-2 font-bold bg-yellow-300 text-yellow-700 rounded-sm">
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
