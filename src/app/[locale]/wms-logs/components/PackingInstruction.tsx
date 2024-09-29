import React, { useEffect } from "react";
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
import { WMSLog } from "@/types/todo";
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
        return (
          <div>
            {item.composite_item_domains.length ? (
              <Composite compositeDomains={item.composite_item_domains} />
            ) : (
              <div className="border rounded bg-slate-50">
                {/* display name, sku, barcode, qty to pick (style table) */}
                <div className="flex justify-between items-center p-2">
                  <div>
                    {item.product_name}

                    <div>{item.sku}</div>
                    <div>{item.barcode}</div>
                  </div>

                  <div className="font-bold text-2xl bg-white px-2 ">
                    {item.quantity}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PackingInstruction;
