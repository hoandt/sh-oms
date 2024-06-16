"use client";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { PAGE_SIZE_TABLE, formatCurrency } from "@/lib/helpers";
import {
  useGetInboundBySapo,
  useGetInventoriesBySapo,
  useGetLocationBySapo,
} from "@/query-keys";
import { IIventoriesSapo } from "@/types/inventories";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Filter } from "./components/Filter";
import { InboundSapo } from "@/types/inbound";
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

  const { data: inventories, isLoading } = useGetInboundBySapo({
    page: pageIndex + 1,
    pageSize,
    keyword,
    created_on_max,
    created_on_min,
  });

  const { data: locations } = useGetLocationBySapo();

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"Code Inbound"}</div>,
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "item",
        header: () => <div className="">{"Actived On"}</div>,
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
        accessorKey: "sku",
        header: () => <div className="">{"Status"}</div>,
        cell: ({ row }) => {
          const status = row.original.status || "-";
          return <Badge className="uppercase">{status}</Badge>;
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
          return <Badge className="uppercase">{receiveStatus}</Badge>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "available",
        header: () => <div className="">{"Chi nhánh nhập"}</div>,
        cell: ({ row }) => {
          //reduce total inventory available
          const available = locations?.data.find(
            (e) => e.id.toString() === row.original.location_id.toString()
          );
          return <div>{available?.label}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "available",
        header: () => <div className="">{"Supplier"}</div>,
        cell: ({ row }) => {
          const supplier = row.original.supplier_data.name;
          return <div>{supplier}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "available",
        header: () => <div className="">{"Price"}</div>,
        cell: ({ row }) => {
          const available = row.original.total_price;
          return <div>{formatCurrency(available)}</div>;
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
