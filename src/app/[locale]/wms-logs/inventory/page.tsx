"use client";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { useGetInventoriesBySapo } from "@/query-keys";
import { IIventoriesSapo } from "@/types/inventories";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";

const Page = () => {
  const router = useRouter();
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });
  const params = useSearchParams();
  const keyword = params.get("q") || "";

  const { data: inventories, isLoading } = useGetInventoriesBySapo({
    page: pageIndex + 1,
    pageSize,
    keyword,
  });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "transaction",
        header: () => <div className="">{"Item"}</div>,
        cell: ({ row }) => {
          const productName = row.original.product_name || "-";
          return <div className="flex space-x-2">{productName}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "sku",
        header: () => <div className="">{"SKU"}</div>,
        cell: ({ row }) => {
          const user = row.original.sku || "-";
          return <div>{user}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "user",
        header: () => <div className="">{"Onhands"}</div>,
        cell: ({ row }) => {
          const inventory =
            row.original.inventories!.reduce((acc, cur) => {
              return acc + cur.on_hand;
            }, 0) || "-";
          return <div>{inventory}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "type",
        header: () => <div className="">{"Ngày khởi tạo"}</div>,
        cell: ({ row }) => {
          const created_on = row.original.created_on || "-";
          return <div>{format(created_on, "dd/MM/yyyy HH:mm")}</div>;
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "type",
        header: () => <div className="">{"Giá bán lẻ"}</div>,
        cell: ({ row }) => {
          const created_on = row.original.init_stock || "-";
          return <div>{created_on}</div>;
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "type",
        header: () => <div className="">{"Giá nhập"}</div>,
        cell: ({ row }) => {
          const created_on = row.original.init_stock || "-";
          return <div>{created_on}</div>;
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "type",
        header: () => <div className="">{"Giá bán buôn"}</div>,
        cell: ({ row }) => {
          const created_on = row.original.init_stock || "-";
          return <div>{created_on}</div>;
        },
        enableSorting: true,
        enableHiding: false,
      },
    ] as ColumnDef<IIventoriesSapo>[];
  }, []);

  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <CommonTable
            extraActionTable={[]}
            filterComponent={<></>}
            onClickRow={(e) => {
              router.push(
                `/wms-logs/inventory/detail/${e.original.product_id}`
              );
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
