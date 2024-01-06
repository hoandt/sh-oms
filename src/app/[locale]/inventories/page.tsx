"use client";

import React, {  useMemo} from "react";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { CommonTable } from "@/components/common/table/CommonTable";
import { OmsInbound, SystemInventory } from "@/types/todo";
import { useGetInventories } from "@/query-keys";
import Image from "next/image";
import { defaultImage } from "@/lib/constants";
import Transactions from "./components/TransactionSubTable";

export default function Inventory() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE
    });

  const {
    data: inventories,
    isLoading: loadingOutbounds,
    refetch
  } = useGetInventories({
    code: keyword,
    page: pageIndex,
    pageSize
  });

  const columns = useMemo(() => {
    return [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              {row.getIsExpanded() ? '👇' : '👉'}
            </button>
          ) : (
            '🔵'
          )
        },
      },
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => (
          <div>
            {row.getValue("id")}
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "code",
        header: () => <div>{"Hình ảnh"}</div>,
        cell: ({ row }) => {
          const images = row.original.system_item_master?.data.attributes.images || defaultImage;
          return (
            <div className="flex space-x-2">
              <Image height={96} width={96} src={images} alt="" />
            </div>
          );
        }
      },
      {
        accessorKey: "status",
        header: () => <div className="">{"Tên sản phẩm"}</div>,
        cell: ({ row }) => {
          const name = row.original.system_item_master.data.attributes.name;
          return (
            <div className="flex space-x-2">
              {name}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "priority",
        header: () => <div className="">{"Tồn kho"}</div>,
        cell: ({ row }) => {
          const qty = row.original.availableQty || 0;
          return <div>{qty}</div>
        },
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "sku",
        header: () => <div className="">{"SKU"}</div>,
        cell: ({ row }) => {
          const sku = row.original.system_item_master.data.attributes.sku || 0;
          return <div>{sku}</div>
        },
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Ghi chú"}</div>,
        cell: ({ row }) => <div>{row.getValue("note") || "-"}</div>,
        enableSorting: false,
        enableHiding: false
      },
    ] as ColumnDef<SystemInventory>[];
  }, []);

  const renderSubComponent = ({ row }: { row: Row<SystemInventory> }) => {
    return (
        <Transactions id={row.original.id} />
    )
  }
  
  return (
    <CommonTable
        extraActionTable={[
          {
            label: "Confirm Outbound",
            value: "CONFIRM"
          }
        ]}
        onCallbackExtraActionTable={({ type, selected, data }) => {
          if (type === "CONFIRM") {
            alert("CONFIRM")
          }
          if (type == "DELETE") {
            alert("DELETE");
          }
        }}
        filterComponent={null}
        data={(inventories?.data as OmsInbound[]) || []}
        columns={columns}
        isLoading={loadingOutbounds}
        setPagination={setPagination}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.ceil(
          (inventories?.meta?.pagination?.total || 0) / pageSize
        ) || 1}
        getRowCanExpand={() => true}
        renderSubComponent={renderSubComponent}  
      />
  );
}
