"use client";

import { CommonTable } from "@/components/common/table/CommonTable";
import { defaultImage } from "@/lib/constants";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { useGetCustomers, useGetSystemItemMaster } from "@/query-keys";
import { OmsUser, SystemItemMaster } from "@/types/todo";
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
    data: customers,
    isLoading: loadingItems,
    refetch,
  } = useGetCustomers({
    code: keyword,
    page: pageIndex,
    pageSize,
  });

  console.log({customers});

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        header: () => <div>{"ID"}</div>,
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
        accessorKey: "phone",
        header: () => <div className="">{"Giá bàn"}</div>,
        cell: ({ row }) => {
          const phone = row.original.attributes.phone || "-";
          return <div className="flex space-x-2">{phone}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "address",
        header: () => <div className="">{"Địa chỉ"}</div>,
        cell: ({ row }) => {
          const address = row.original.attributes.contact?.address || "-";
          return <div className="flex space-x-2">{address}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Quận huyện"}</div>,
        cell: ({ row }) => {
          const district = row.original.attributes?.contact?.address_district?.data?.attributes.name || "-";
          return <div className="flex space-x-2">{district}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Tỉnh thành"}</div>,
        cell: ({ row }) => {
          const province = row.original.attributes?.contact?.address_province?.data?.attributes.name || "-";
          return <div className="flex space-x-2">{province}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<OmsUser>[];
  }, []);

  return (
    <CommonTable
      data={(customers?.data as OmsUser[]) || []}
      columns={columns}
      isLoading={loadingItems}
      setPagination={setPagination}
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={
        Math.ceil((customers?.meta?.pagination?.total || 0) / pageSize) || 1
      }
    />
  );
}
