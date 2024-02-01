"use client";

import { IndeterminateCheckbox } from "@/components/common/custom/Checkbox";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Badge } from "@/components/ui/badge";
import { DataResponseDeliveryMethod } from "@/types/customer";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

export default function TableDelivery({
  data,
  loading,
}: {
  data?: DataResponseDeliveryMethod[];
  loading: boolean;
}) {
  const columns = useMemo(() => {
    return [
      {
        id: "select",
        size: 8,
        header: ({ table }) => (
          <div className="w-2">
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-2 px-1 py-3">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: () => <div>{"Tên"}</div>,
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span>{row.getValue("name")}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "duration",
        header: () => <div className="">{"Thời gian giao"}</div>,
        cell: ({ row }) => (
          <Badge className="uppercase">{row.getValue("duration")}</Badge>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "total_fee",
        header: () => <div className="">{"Phí"}</div>,
        cell: ({ row }) => {
          console.log({ row });
          return (
            <div className="flex space-x-2">{row.getValue("total_fee")}</div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<DataResponseDeliveryMethod>[];
  }, []);

  return (
    <CommonTable data={data || []} columns={columns} isLoading={loading} />
  );
}
