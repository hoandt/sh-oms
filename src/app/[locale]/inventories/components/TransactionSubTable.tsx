"use client";

import { CommonTable } from "@/components/common/table/CommonTable";
import { Badge } from "@/components/ui/badge";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { useGetTransactionsByInboundId } from "@/query-keys";
import { OmsInbound, SystemTransaction } from "@/types/todo";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

export default function Transactions({ id }: { id: number }) {
  const t = useTranslations("Secret");

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });

  const { data: transactions, isLoading: loadingTransaction } =
    useGetTransactionsByInboundId({
      id,
      page: pageIndex,
      pageSize,
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
        accessorKey: "type",
        header: () => <div className="">{"Trạng thái"}</div>,
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <Badge>{row.original.type}</Badge>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "code",
        header: () => <div>{"Số lượng"}</div>,
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span>{row.original.qty}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Ghi chú"}</div>,
        cell: ({ row }) => <div>{row.getValue("note") || "-"}</div>,
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<SystemTransaction>[];
  }, []);

  return (
    <CommonTable
      filterComponent={null}
      data={(transactions?.data as SystemTransaction[]) || []}
      columns={columns}
      isLoading={loadingTransaction}
    />
  );
}
