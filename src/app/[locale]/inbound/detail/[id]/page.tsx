"use client";
import { BackButton } from "@/components/common/custom/BackButton";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useGetInboundDetailBySapo } from "@/query-keys";
import { InboundSapoLineItem } from "@/types/inbound";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const schema = z.object({
    variantId: z.string().nullish(),
  });

  const { data } = useGetInboundDetailBySapo({
    id,
  });

  const orderList = data?.data?.line_items || [];
  const totalQuantity = orderList.reduce((total, item) => {
    return total + (item.quantity || 0); // Add the quantity if it exists, otherwise add 0
  }, 0);
  const totalLines = orderList.length;
  const columns = useMemo(() => {
    return [
      // sku
      {
        accessorKey: "sku",
        header: () => <div>{"SKU"}</div>,
        cell: ({ row }) => <div>{row.original.sku}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>{"Expected Qty"}</div>,
        cell: ({ row }) => <div>{row.original.quantity}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>{"Actual Qty"}</div>,
        cell: ({ row }) => <div>{row.original.accepted_quantity}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "account_name",
        header: () => <div>{"Item Name"}</div>,
        cell: ({ row }) => <div>{row.original.title}</div>,
        enableSorting: false,
      },
    ] as ColumnDef<InboundSapoLineItem>[];
  }, []);

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <BackButton
          onClick={() => {
            router.push("/inbound");
          }}
        />

        <h1 className="text-xl font-bold">{data?.data?.code}</h1>
        <p className="text-lg text-gray-400"> {data?.data?.status}</p>
      </div>
      <Card className="w-full">
        <CardContent className="space-y-2 p-4">
          <CommonTable
            columns={columns}
            data={orderList || []}
            isLoading={false}
          />

          <div>
            <ul className="grid gap-2  ">
              <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-sm text-muted-foreground ">
                  {"Total Qty"}
                </span>
                <div className="flex items-center justify-between gap-5">
                  <span className="font-black">{totalQuantity || "0"}</span>
                </div>
              </li>
              <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-sm text-muted-foreground">
                  {"Total Line"}
                </span>
                <div className="flex items-center justify-between gap-5">
                  <span className="font-black">{totalLines || "0"}</span>
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="mt-4 space-y-4">
          <div className="flex   gap-2">
            <ul className="grid gap-2">
              <li className="flex items-center  gap-7">
                <span className="text-muted-foreground">{"Shipper"}</span>
                <span className="text-sm">
                  {data?.data?.supplier_data.name}{" "}
                  {data?.data?.supplier_address?.address1 || "-"}
                </span>
              </li>

              <li className="flex items-center  gap-7">
                <span className="text-muted-foreground">{"Note"}</span>
                <span className="text-sm">{data?.data?.note || "-"}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
