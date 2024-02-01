"use client";

import { CommonTable } from "@/components/common/table/CommonTable";
import { defaultImage } from "@/lib/config";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { useGetSystemItemMaster } from "@/query-keys";
import { SystemItemMaster } from "@/types/todo";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";

export default function SystemItemMaster() {
  const t = useTranslations("Secret");
  const router = useRouter();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });

  const {
    data: items,
    isLoading: loadingItems,
    refetch,
  } = useGetSystemItemMaster({
    code: keyword,
    page: pageIndex,
    pageSize,
  });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "code",
        header: () => <div>{"Hình ảnh"}</div>,
        cell: ({ row }) => {
          const images = row.original.attributes.images || defaultImage;
          return (
            <div className="flex space-x-2">
              <Image height={96} width={96} src={images} alt="" />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: () => <div>{"Tên"}</div>,
        cell: ({ row }) => {
          const name = row.original.attributes.name || "-";
          return <div className="flex space-x-2">{name}</div>;
        },
      },
      {
        accessorKey: "priority",
        header: () => <div className="">{"Giá bàn"}</div>,
        cell: ({ row }) => <div>{row.getValue("priority")}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "codAmount",
        header: () => <div className="">{"Tồn có thể xuất"}</div>,
        cell: ({ row }) => <div>{row.getValue("codAmount")}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Số lô"}</div>,
        cell: ({ row }) => <div>{row.getValue("note") || "-"}</div>,
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<SystemItemMaster>[];
  }, []);

  return (
    <CommonTable
      data={(items?.data as SystemItemMaster[]) || []}
      columns={columns}
      isLoading={loadingItems}
      setPagination={setPagination}
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={
        Math.ceil((items?.meta?.pagination?.total || 0) / pageSize) || 1
      }
    />
  );
}
