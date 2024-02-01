import { Button } from "@/components/Button";
import { ColumnDef, Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { priceFormat } from "@/lib/helpers";

const AddToOutbound = ({ product }: { product: Row<any> }) => {
  const [currentProductIds, setCurrentProductIds] = useState<number[]>();
  const isSelected =
    currentProductIds?.includes(product.original.system_item_master.data.id) ||
    false;
  const label = isSelected ? "Bỏ khỏi phiếu" : "Thêm vào phiếu";
  const handleClick = (isSelected: boolean) => {};

  return <Button onClick={() => handleClick(false)}>{label}</Button>;
};

const productColumns: ColumnDef<any>[] = [
  {
    accessorKey: "images",
    header: () => "Hình ảnh",
    cell: (info) => {
      const src = info.row.original.system_item_master.data.attributes.images;
      return (
        <Link
          className="cursor-pointer"
          href={`/oms/products/${info.row.original.system_item_master.data.id}`}
        >
          <Image
            className="rounded border p-1 border-gray-100 bg-white"
            alt="Product"
            width={68}
            height={68}
            src={src}
          />
        </Link>
      );
    },
    footer: (props) => props.column.id,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: () => <span>Tên</span>,
    sortingFn: (a, b) => {
      if (
        a.original.system_item_master.data.attributes.name ===
        b.original.system_item_master.data.attributes.name
      ) {
        return a > b ? 1 : -1;
      }
      return a.original.system_item_master.data.attributes.name >
        b.original.system_item_master.data.attributes.name
        ? 1
        : -1;
    },
    cell: (info) => (
      <div className="flex flex-col">
        <Link
          className="cursor-pointer text-blue-900"
          href={`/oms/products/${info.row.original.system_item_master.data.id}`}
        >
          {`${info.row.original.system_item_master.data.attributes.name}`}
        </Link>
        <div>
          <span className="cursor-pointer text-gray-500">
            {`${info.row.original.system_item_master.data.attributes.sku}`}
          </span>
        </div>
      </div>
    ),
    footer: (props) => props.column.id,
  },

  {
    accessorKey: "price",
    header: "Giá bán",
    sortingFn: (a, b) => {
      if (
        a.original.system_item_master.data.attributes.price ===
        b.original.system_item_master.data.attributes.price
      ) {
        return a > b ? 1 : -1;
      }
      return a.original.system_item_master.data.attributes.price >
        b.original.system_item_master.data.attributes.price
        ? 1
        : -1;
    },
    cell: (info) =>
      info.row.original.system_item_master.data.attributes.price > 0
        ? priceFormat.format(
            Number.parseInt(
              `${info.row.original.system_item_master.data.attributes.price}`
            )
          )
        : 0,
    footer: (props) => props.column.id,
  },

  {
    accessorKey: "in_stock",
    header: "Tồn có thể xuất",
    sortingFn: (a, b) => {
      if (a.original.availableQty === b.original.availableQty) {
        return a > b ? 1 : -1;
      }
      return a.original.availableQty > b.original.availableQty ? 1 : -1;
    },
    cell: (info) => info.row.original.availableQty,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "reserved",
    header: "Tồn đang xử lý",
    sortingFn: (a, b) => {
      if (a.original.reservedQty === b.original.reservedQty) {
        return a > b ? 1 : -1;
      }
      return a.original.reservedQty > b.original.reservedQty ? 1 : -1;
    },
    cell: (info) => info.row.original.reservedQty,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "lot",
    header: "Số Lô",

    cell: (info) => info.getValue() || "-",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "exp",
    header: "HSD",
    cell: (info) => (
      <span>
        {info.getValue()
          ? format(new Date(info.getValue() as string), "dd/MM/yyyy")
          : "-"}
      </span>
    ),
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "actions",
    header: "Hành động",
    cell: (info) => <AddToOutbound product={info.row} />,
    footer: (props) => props.column.id,
  },
];

export default productColumns;
