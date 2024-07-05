"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import InventoryPicker, { formOrderLine } from "./components/InventoryPicker";
import { IIventoriesSapo } from "@/types/inventories";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type SapoOrderForm = {
  status: string;
  customer_id: number;
  shipping_address: string | null;
  phone_number: string;
  assignee_id: number;
  price_list_id: number;
  location_id: number;
  note: string;
  tags: string[];
  source_id: number;
  source_name: string;
  reference_url: string;
  reference_number: string;
  code: string;
  create_invoice: boolean;
  order_line_items: {
    product_id: number;
    variant_id: number;
    is_freeform: boolean;
    price: number;
    tax_included: boolean;
    tax_rate_override: number;
    note: string;
    quantity: number;
    discount_items: any[]; // Assuming discount items can vary
  }[];
  discount_items: any[]; // Assuming discount items can vary
  expected_delivery_provider_id: number;
  coupon_code: string | null;
  promotion_redemptions: any[]; // Assuming promotions can vary
  operation_system: string;
};
const SapoOrderForm = z.object({
  status: z.string(),
  customer_id: z.number(),
  shipping_address: z.string().nullable(),
  phone_number: z.string(),
  assignee_id: z.number(),
  price_list_id: z.number(),
  location_id: z.number(),
  note: z.string().min(12, { message: "Note must be at least 6 characters" }),
  tags: z.array(z.string()),
  source_id: z.number(),
  source_name: z.string(),
  reference_url: z.string(),
  reference_number: z.string(),
  code: z.string(),
  create_invoice: z.boolean(),
  order_line_items: z.array(
    z.object({
      product_id: z.number(),
      variant_id: z.number(),
      is_freeform: z.boolean(),
      price: z.number(),
      tax_included: z.boolean(),
      tax_rate_override: z.number(),
      note: z.string(),
      quantity: z.number(),
      discount_items: z.array(z.object({})),
    })
  ),
  discount_items: z.array(z.object({})),
  expected_delivery_provider_id: z.number(),
  coupon_code: z.string().nullable(),
  promotion_redemptions: z.array(z.object({})),
  operation_system: z.string(),
});
const OrderForm = () => {
  const form = useForm<z.infer<typeof SapoOrderForm>>({
    resolver: zodResolver(SapoOrderForm),
    defaultValues: {
      status: "draft",
      customer_id: 489680881,
      assignee_id: 1085269,
      price_list_id: 2173336,
      location_id: 719032,
      source_id: 8022735,
      source_name: "Web",
      create_invoice: false,
      expected_delivery_provider_id: 463958,
      operation_system: "web",
      order_line_items: [],
    },
  });
  const handleQtyChange = (
    itemLines: z.infer<typeof formOrderLine>[],
    selectedItems: IIventoriesSapo[]
  ) => {
    console.log(itemLines, selectedItems);
    form.setValue(
      "order_line_items",
      selectedItems.map((item) => {
        return {
          product_id: item.product_id,
          variant_id: item.id,
          is_freeform: false,
          price: 0,
          tax_included: false,
          tax_rate_override: 0,
          note: "",
          quantity: itemLines[item.id].quantity,
          discount_items: [],
        };
      })
    );
  };
  // onsubmit function
  const onSubmit = (data: z.infer<typeof SapoOrderForm>) => {
    console.log(data);
    //set error message if order_line_items is empty
    if (data.order_line_items.length === 0) {
      alert("Please select at least one item");
    }
  };
  return (
    <div className="px-4">
      <InventoryPicker handleQtyChange={handleQtyChange} />
      <Form {...form}>
        <div className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col gap-2">
            <Label>{"Customer Info"}</Label>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <div className="flex items-center gap-1">
                  <Textarea {...field} />
                </div>
              )}
            />
          </div>
          {/* display select for: Is Urgent */}
          <div className="flex flex-col gap-2">
            <Label>{"Is Urgent"}</Label>
            <div className="flex items-center gap-1">
              <Checkbox
                className="h-5 w-5 text-slate-500"
                onChange={(e) => form.setValue("note", "e.target.checked")}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              className=" gap-2"
              // disaable if no selected items

              onClick={() => onSubmit(form.getValues())}
              type="submit"
            >
              {"Submit"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default OrderForm;
