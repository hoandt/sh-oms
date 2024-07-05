"use client";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { PAGE_SIZE_TABLE, formatCurrency } from "@/lib/helpers";
import { useGetInboundBySapo, useGetLocationBySapo } from "@/query-keys";
import { IIventoriesSapo } from "@/types/inventories";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Filter } from "./components/Filter";
import { InboundSapo } from "@/types/inbound";
import { Badge } from "@/components/ui/badge";
const STATUS = {
  finalized: {
    label: "Processing",
    color: "blue",
  },
  completed: {
    label: "Completed",
    color: "green",
  },
  cancelled: {
    label: "Canceled",
    color: "red",
  },
} as {
  [key: string]: {
    label: string;
    color: string;
  };
};
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

  const { data: inventories, isLoading } = useGetInboundBySapo({
    page: pageIndex + 1,
    pageSize,
    keyword,
    created_on_max,
    created_on_min,
  });

  // const { data: locations } = useGetLocationBySapo();

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "code",
        width: 60,
        header: () => <div>{"Inbound Ref"}</div>,
        cell: ({ row }) => <div>{row.getValue("code")}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "totalItems",
        header: () => <div className="">{"Total Lines"}</div>,
        cell: ({ row }) => {
          const note = row.original.line_items.length;
          return <div>{note}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "totalQty",
        header: () => <div className="">{"Total Qty"}</div>,
        cell: ({ row }) => {
          const qty = row.original.line_items.reduce(
            (acc, cur) => acc + cur.quantity,
            0
          );
          return <div>{qty}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "item",
        header: () => <div className="">{"Completed On"}</div>,
        cell: ({ row }) => {
          const activedOn = row.original.activated_on || "-";
          return (
            <div className="flex space-x-2">
              {format(activedOn, "dd/MM/yyyy HH:mm")}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "on_hand",
        header: () => <div className="">{"Received Status"}</div>,
        cell: ({ row }) => {
          //reduce total inventory available
          const receiveStatus = row.original.receive_status;
          return (
            <span className=" capitalize border rounded bg-slate-200 px-2">
              {receiveStatus}
            </span>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "sku",
        header: () => <div className="">{"Status"}</div>,
        cell: ({ row }) => {
          const status = row.original.status || "-";
          return (
            <span
              className={`    rounded bg-${STATUS[status].color}-100 text-${STATUS[status].color}-600 border-${STATUS[status].color}-500  px-2`}
            >
              {STATUS[status] && STATUS[status].label}
            </span>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<InboundSapo>[];
  }, []);

  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <CommonTable
            extraActionTable={[]}
            filterComponent={<Filter />}
            onClickRow={(e) => {
              router.push(`/inbound/detail/${e.original.id}`);
            }}
            data={(inventories?.data as any[]) || []}
            columns={columns}
            isLoading={isLoading}
            setPagination={setPagination}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={
              Math.ceil((inventories?.meta?.total || 0) / pageSize) || 1
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
