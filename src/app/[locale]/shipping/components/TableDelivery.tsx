"use client";

import { CommonTable } from "@/components/common/table/CommonTable";
import { Badge } from "@/components/ui/badge";
import { DataResponseDeliveryMethod } from "@/types/customer";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

const optionsTabs = [
  {
    label: "Đơn mới",
    value: "waiting_for_confirm",
  },
  { label: "Đơn hoàn thành", value: "done" },
  { label: "Đơn huỷ", value: "cancelled" },
];

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

  if (!data?.length) {
    return null;
  }

  return (
    <CommonTable data={data || []} columns={columns} isLoading={loading} />
  );
}
