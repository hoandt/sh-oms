import React, { useEffect } from "react";
import { useGetOutboundDetailBySapo } from "@/query-keys/outbound";
import Composite from "./Composite";
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
const orderIdScan = z.object({
  orderID: z
    .string({ required_error: "Vui lòng nhập mã đơn nhập" })
    .min(1, { message: "Vui lòng nhập mã đơn nhập" }),
});

const PickingBarcodeScanner = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [orderId, setOrderId] = React.useState<string>("");
  const { data } = useGetOutboundDetailBySapo({
    id: orderId,
  });
  const form = useForm<z.infer<typeof orderIdScan>>({
    resolver: zodResolver(orderIdScan),
    defaultValues: {
      orderID: "",
    },
  });

  useEffect(() => {
    form.setFocus("orderID");
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        form.setFocus("orderID");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form]);
  function onSubmit(values: z.infer<typeof orderIdScan>) {
    form.setValue("orderID", "");
    setOrderId(values.orderID);
  }
  return (
    <div>
      {/* scan form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="orderID"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Scan mã vận đơn"
                    {...field}
                    height={24}
                    className="text-xl px-4 py-8 w-full ring-1 ring-gray-300 rounded-md focus:ring-orange-500 outline-orange-100 focus:outline-none transition duration-200 ease-in-out"
                  />
                </FormControl>
                <FormDescription className="relative mt-2">
                  <span>
                    Scan mã vận đơn . Bấm{" "}
                    <span className="bg-white border rounded shadow px-1">
                      F9
                    </span>{" "}
                    để focus.
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {/* display order detail */}

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
                <span className=" text-red-500 bg-red-50 px-2">
                  Not Fulfilled
                </span>
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

export default PickingBarcodeScanner;
