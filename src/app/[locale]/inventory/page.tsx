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
import { Filter } from "./components/Filter";

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

  const { data: inventories, isLoading } = useGetInventoriesBySapo({
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
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        enableSorting: false,
      },

      {
        accessorKey: "item",
        header: () => <div className="">{"Item"}</div>,
        cell: ({ row }) => {
          const isBunble = row.original.composite;

          const productName = row.original.product_name || "-";
          return (
            <div className="flex gap-1">
              {productName}{" "}
              {isBunble && (
                <span className="border rounded bg-slate-200 text-slate-600 text-sm px-1">
                  BUNDLED
                </span>
              )}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "sku",
        header: () => <div className="">{"SKU"}</div>,
        cell: ({ row }) => {
          const sku = row.original.sku || "-";
          return <div>{sku}</div>;
        },
      },
      {
        accessorKey: "on_hand",
        header: () => <div className="">{"On Hand"}</div>,
        cell: ({ row }) => {
          //reduce total inventory available
          const onHand = row.original.inventories?.reduce(
            (acc, cur) => acc + cur.on_hand,
            0
          );
          return <div>{onHand}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "available",
        header: () => <div className="">{"Available"}</div>,
        cell: ({ row }) => {
          //reduce total inventory available
          const available = row.original.inventories?.reduce(
            (acc, cur) => acc + cur.available,
            0
          );
          return <div>{available}</div>;
        },
        enableSorting: false,
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
            filterComponent={<Filter />}
            onClickRow={(e) => {
              router.push(`/inventory/detail/${e.original.product_id}`);
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
