"use client";

import { CommonTable } from "@/components/common/table/CommonTable";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { useGetInventories, useGetOutbounds } from "@/query-keys";
import { SystemInventory } from "@/types/todo";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";

import React, { useMemo } from "react";

export default function InventoryTable() {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });

  const {
    data: inventories,
    isLoading: loadingInventories,
    refetch,
  } = useGetInventories({
    page: pageIndex,
    pageSize,
  });

  console.log({ inventories });

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
        accessorKey: "code",
        header: () => <div>{"Tên"}</div>,
        cell: ({ row }) => {
          const name = row.original.system_item_master.data.attributes.name;
          return (
            <div className="flex space-x-2">
              <span>{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="">{"Giá bán"}</div>,
        cell: ({ row }) => {
          const price = row.original.system_item_master.data.attributes.price;
          return (
            <div className="flex space-x-2">
              <span>{price}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "priority",
        header: () => <div className="">{"Tồn có thể xuất"}</div>,
        cell: ({ row }) => {
          const availableQty = row.original.availableQty;
          return (
            <div className="flex space-x-2">
              <span>{availableQty}</span>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "codAmount",
        header: () => <div className="">{"Số lô"}</div>,
        cell: ({ row }) => <div>{row.getValue("lot") || "-"}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"HSD"}</div>,
        cell: ({ row }) => <div>{row.getValue("note") || "-"}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "action",
        header: () => <div className="">{""}</div>,
        cell: ({ row }) => <div className="flex gap-2"></div>,
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<SystemInventory>[];
  }, []);

  return (
    <CommonTable
      data={(inventories?.data as SystemInventory[]) || []}
      columns={columns}
      isLoading={loadingInventories}
      setPagination={setPagination}
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={
        Math.ceil((inventories?.meta?.pagination?.total || 0) / pageSize) || 1
      }
    />
  );
}
