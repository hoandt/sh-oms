"use client";
import { BackButton } from "@/components/common/custom/BackButton";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useGetInboundDetailBySapo } from "@/query-keys";
import { useGetOutboundDetailBySapo } from "@/query-keys/outbound";
import { InboundSapoLineItem } from "@/types/inbound";
import { OrderLineItem } from "@/types/outbound";
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
  const { queryParams, setQueryParams } = useQueryParams({
    schema,
    defaultValues: {
      variantId: undefined,
    },
  });

  const { data } = useGetInboundDetailBySapo({
    id,
  });

  const orderList = data?.data?.line_items || [];
  const totalQuantity = orderList.reduce((total, item) => {
    return total + (item.quantity || 0); // Add the quantity if it exists, otherwise add 0
  }, 0);
  const total = orderList.reduce((total, item) => {
    return total + (item.price || 0); // Add the quantity if it exists, otherwise add 0
  }, 0);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "account_name",
        header: () => <div>{"Item Name"}</div>,
        cell: ({ row }) => <div>{row.original.title}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>{"Quantity"}</div>,
        cell: ({ row }) => <div>{row.original.quantity}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>{"Price"}</div>,
        cell: ({ row }) => <div>{row.original.price}</div>,
        enableSorting: false,
      },
    ] as ColumnDef<InboundSapoLineItem>[];
  }, []);

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <BackButton
          onClick={() => {
            router.push("/inventory");
          }}
        />
        <span>{data?.data?.code || "-"}</span>
        <Badge>{data?.data?.status || "-"}</Badge>
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
              <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-muted-foreground">{"Quantity"}</span>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm">{totalQuantity || "0"}</span>
                </div>
              </li>
              <li className="flex items-center justify-between gap-7 w-[200px]">
                <span className="text-muted-foreground">{"Total Price"}</span>
                <span className="text-sm">{total || "0"}</span>
              </li>
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
                  {"Supplier Information"}
                </span>
                <span className="text-sm">
                  {data?.data?.supplier_data.name}
                </span>
              </li>
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">{"Address"}</span>
                <span className="text-sm">
                  {data?.data?.supplier_address.address1 || "-"}
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
