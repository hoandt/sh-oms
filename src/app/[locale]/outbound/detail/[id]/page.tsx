"use client";
import { BackButton } from "@/components/common/custom/BackButton";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/useQueryParams";
import { formatCurrency } from "@/lib/helpers";
import { useGetOutboundDetailBySapo } from "@/query-keys/outbound";
import { OrderLineItem } from "@/types/outbound";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";
import Composite from "../../components/Composite";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const schema = z.object({
    variantId: z.string().nullish(),
  });
  const { queryParams, setQueryParams } = useQueryParams({
    schema,
    defaultValues: {
      variantId: undefined,
    },
  });

  const { data } = useGetOutboundDetailBySapo({
    id,
  });

  const orderList = data?.data?.order_line_items || [];
  const totalQuantity = orderList.reduce((total, item) => {
    return total + (item.quantity || 0); // Add the quantity if it exists, otherwise add 0
  }, 0);

  const columns = useMemo(() => {
    return [
      // qty
      {
        accessorKey: "sku",
        header: () => <div>{"SKU"}</div>,
        cell: ({ row }) => {
          const compositeItems = row.original.composite_item_domains;
          //if

          return (
            <div
              className={
                compositeItems.length > 0 ? "text-blue-900 font-black" : ""
              }
            >
              {row.original.sku}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>{"Quantity"}</div>,
        cell: ({ row }) => <div>{row.original.quantity}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "onhand_adj",
        header: () => <div> </div>,
        cell: ({ row }) => (
          //  is composite item, display, else none
          <div>
            {row.original.composite_item_domains.length > 0 && (
              <Composite
                compositeDomains={row.original.composite_item_domains}
              />
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "account_name",
        header: () => <div>{"Item Name"}</div>,
        cell: ({ row }) => {
          const compositeItems = row.original.composite_item_domains;
          return (
            <div>
              <div>{row.original.product_name}</div>
            </div>
          );
        },
        enableSorting: false,
      },
      // {
      //   accessorKey: "source",
      //   header: () => <div>{"Price"}</div>,
      //   cell: ({ row }) => <div>{formatCurrency(row.original.price)}</div>,
      //   enableSorting: false,
      // },

      // {
      //   accessorKey: "onhand_adj",
      //   header: () => <div>{"Discount"}</div>,
      //   cell: ({ row }) => (
      //     <div>{formatCurrency(row.original.discount_value)}</div>
      //   ),
      //   enableSorting: false,
      // },
    ] as ColumnDef<OrderLineItem>[];
  }, []);

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <BackButton
          onClick={() => {
            router.back();
          }}
        />
        <h1 className="text-xl font-bold">
          {data?.data?.code || <span>...</span>}
        </h1>
        <p className="text-lg text-gray-400">
          {" "}
          {data?.data?.fulfillments &&
            data?.data?.fulfillments.length &&
            data?.data?.fulfillments[0].status}
        </p>
      </div>
      <Card className="w-full">
        <CardContent className="space-y-2 p-4">
          <CommonTable
            columns={columns}
            data={orderList || []}
            isLoading={false}
          />

          <div>
            <ul className="grid gap-2 justify-end">
              {/* <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-muted-foreground">{"Quantity"}</span>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm">{totalQuantity}</span>
                </div>
              </li> */}
              {/* <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-muted-foreground">{"Discount"}</span>
                <span className="text-sm">
                  {data?.data?.fulfillments[0]?.discount_value || "0"}
                </span>
              </li>
              <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-muted-foreground">{"Fee ship"}</span>
                <span className="text-sm">
                  {data?.data?.fulfillments[0]?.ship || "0"}
                </span>
              </li> */}
              {/* <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-muted-foreground">{"Total Price"}</span>
                <span className="text-sm">
                  {data?.data?.fulfillments[0]?.total || "0"}
                </span>
              </li> */}
            </ul>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="mt-4 space-y-4">
          <div className="flex flex-row justify-between gap-2">
            <ul className="grid gap-2">
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">
                  {"Customer Information"}
                </span>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm">
                    {data?.data?.customer_data.name}
                  </span>
                  <span className="text-sm">{data?.data?.phone_number}</span>
                </div>
              </li>
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">{"Address"}</span>
                <span className="text-sm">
                  {data?.data?.shipping_address?.address1 || "-"}
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
