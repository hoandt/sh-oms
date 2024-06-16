"use client";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { PAGE_SIZE_TABLE, formatCurrency } from "@/lib/helpers";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Filter } from "./components/Filter";
import { useGetOutboundsBySapo } from "@/query-keys/outbound";
import { IOutbound } from "@/types/outbound";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const router = useRouter();
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });

  const params = useSearchParams();
  const keyword = params.get("q") || "";
  const created_on_max = params.get("created_on_max") || "";
  const created_on_min = params.get("created_on_min") || "";

  const { data: outbounds, isLoading } = useGetOutboundsBySapo({
    page: pageIndex + 1,
    pageSize,
    keyword,
    created_on_max,
    created_on_min,
  });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => {
          const code = row.original.code || "-";
          return <div className="flex space-x-2">{code}</div>;
        },
      },
      {
        accessorKey: "item",
        header: () => <div className="">{"Created On"}</div>,
        cell: ({ row }) => {
          const createdOn = row.original.created_on || "-";
          return (
            <div className="flex space-x-2">
              {format(createdOn, "dd/MM/yyyy HH:mm")}
            </div>
          );
        },
      },
      {
        accessorKey: "sku",
        header: () => <div className="">{"Customer"}</div>,
        cell: ({ row }) => {
          const name = row.original.customer_data.name || "-";
          return <div>{name}</div>;
        },
      },
      {
        accessorKey: "on_hand",
        header: () => <div className="">{"Status"}</div>,
        cell: ({ row }) => {
          const status = row.original.status;
          return <Badge className="uppercase">{status}</Badge>;
        },
      },
      {
        accessorKey: "available",
        header: () => <div className="">{"Payment Status"}</div>,
        cell: ({ row }) => {
          const paymentStatus = row.original.payment_status;
          return <Badge className="uppercase">{paymentStatus}</Badge>;
        },
      },
      {
        accessorKey: "available",
        header: () => <div className="">{"Total"}</div>,
        cell: ({ row }) => {
          const total = row.original.total;
          return <div>{formatCurrency(total)}</div>;
        },
      },
    ] as ColumnDef<IOutbound>[];
  }, []);

  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <CommonTable
            extraActionTable={[]}
            filterComponent={<Filter />}
            onClickRow={(e) => {
              router.push(`/outbound/detail/${e.original.id}`);
            }}
            data={(outbounds?.data as any[]) || []}
            columns={columns}
            isLoading={isLoading}
            setPagination={setPagination}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={Math.ceil((outbounds?.meta?.total || 0) / pageSize) || 1}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
