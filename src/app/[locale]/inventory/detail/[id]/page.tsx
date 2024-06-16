"use client";
import { BackButton } from "@/components/common/custom/BackButton";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  useGetInventoryDetailBySapo,
  useGetInventoryTransactionBySapo,
} from "@/query-keys";
import { IVariantInventory, Variant } from "@/types/inventories";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";

enum INVENTORY_STATUS_PARAMS {
  INVENTORY = "Inventory",
  TRANSACTION = "Transaction",
}

const optionsTabs = [
  {
    label: "Inventory",
    value: INVENTORY_STATUS_PARAMS.INVENTORY,
  },
  {
    label: "Transaction",
    value: INVENTORY_STATUS_PARAMS.TRANSACTION,
  },
];

const LocationIdDefault = 0; /// get all inventory for all location

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const schema = z.object({
    variantId: z.string().nullish(),
    status: z.string(),
  });

  const { queryParams, setQueryParams } = useQueryParams({
    schema,
    defaultValues: {
      variantId: undefined,
      status: INVENTORY_STATUS_PARAMS.INVENTORY,
    },
  });

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });
  const { data } = useGetInventoryDetailBySapo({
    id,
  });

  const selectdVariantIndex =
    data?.data?.variants.findIndex(
      (e) => e.id == Number(queryParams?.variantId)
    ) || 0;
  const selectedVariant =
    selectdVariantIndex !== -1
      ? data?.data?.variants[selectdVariantIndex]
      : ({} as Variant);

  const variantId = data?.data?.variants[0].id;

  useEffect(() => {
    if (data?.data?.variants.length) {
      setQueryParams({ variantId: data?.data?.variants[0]?.id.toString() });
    }
  }, [data?.data?.variants.length]);

  const { data: reports, isLoading: isLoadingReports } =
    useGetInventoryTransactionBySapo({
      page: pageIndex + 1,
      pageSize,
      variantId,
      locationId: LocationIdDefault,
    });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => (
          <div>{format(row.original.issued_at_utc, "dd/MM/yyyy HH:mm")}</div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "account_name",
        header: () => <div>{"Nhân viên"}</div>,
        cell: ({ row }) => <div>{row.original.account_name}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>{"Thao tác"}</div>,
        cell: ({ row }) => <div>{row.original.source}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "onhand_adj",
        header: () => <div>{"Số lượng thay đổi"}</div>,
        cell: ({ row }) => <div>{row.original.onhand_adj}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "onhand",
        header: () => <div>{"On hands"}</div>,
        cell: ({ row }) => <div>{row.original.onhand}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "log_root_id",
        header: () => <div>{"Mã chứng từ"}</div>,
        cell: ({ row }) => (
          <div className="underline text-primary">
            <Link href={`/inbound/detail/${row.original.log_root_id}`}>
              {row.original.log_root_id}
            </Link>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "location_label",
        header: () => <div>{"Warehouse ID"}</div>,
        cell: ({ row }) => <div>{row.original.id}</div>,
        enableSorting: false,
      },
    ] as ColumnDef<IVariantInventory>[];
  }, []);

  const columnsVariantInventory = useMemo(() => {
    return [
      {
        accessorKey: "id",
        header: () => <div>{"Warehouse ID"}</div>,
        cell: ({ row }) => <div>{row.original.id}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "on_hand",
        header: () => <div>{"On hands"}</div>,
        cell: ({ row }) => <div>{row.original.on_hand}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "available",
        header: () => <div>{"Available"}</div>,
        cell: ({ row }) => <div>{row.original.available}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "id",
        header: () => <div>{"Delivering"}</div>,
        cell: ({ row }) => <div>{row.original.committed || 0}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "incoming",
        header: () => <div>{"Return Item"}</div>,
        cell: ({ row }) => <div>{row.original.incoming || 0}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "min_value",
        header: () => <div>{"Shipping Item"}</div>,
        cell: ({ row }) => <div>{row.original.min_value}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "min_value",
        header: () => <div>{"Minimum Stock"}</div>,
        cell: ({ row }) => <div>{row.original.min_value || 0}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "max_value",
        header: () => <div>{"Maximum Stock"}</div>,
        cell: ({ row }) => <div>{row.original.max_value || 0}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "id",
        header: () => <div>{"Inventory Location"}</div>,
        cell: ({ row }) => <div>{"---"}</div>,
        enableSorting: false,
      },
    ] as ColumnDef<any>[];
  }, []);

  const onSelect = (option: string) => {
    setQueryParams({ status: option });
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <BackButton
          onClick={() => {
            router.push("/inventory");
          }}
        />
        <span>{data?.data?.name || "-"}</span>
        <Badge>{data?.data?.status || "-"}</Badge>
      </div>
      <Card className="w-full">
        <CardContent className="space-y-2 p-4">
          <Tabs
            className="flex w-full flex-col gap-4"
            onValueChange={onSelect}
            value={queryParams?.status}
          >
            <div className="flex flex-row">
              <TabsList
                className={cn(
                  "flex",
                  optionsTabs.length && `grid-cols-${optionsTabs.length}`
                )}
              >
                {optionsTabs.map((option, index) => {
                  return (
                    <TabsTrigger
                      className="w-full"
                      key={index}
                      value={option.value}
                    >
                      {option.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {queryParams.status === INVENTORY_STATUS_PARAMS.INVENTORY ? (
              <CommonTable
                columns={columnsVariantInventory}
                data={selectedVariant?.inventories || []}
                isLoading={false}
              />
            ) : (
              <CommonTable
                columns={columns}
                data={reports?.data || []}
                isLoading={isLoadingReports}
                setPagination={setPagination}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={
                  Math.ceil((reports?.meta?.total || 0) / pageSize) || 1
                }
              />
            )}
          </Tabs>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="mt-4 space-y-4">
          <div className="flex flex-row justify-between gap-2">
            <ul className="grid gap-2">
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">{"Category"} </span>
                <span className="text-sm">
                  {data?.data?.product_type || "-"}
                </span>
              </li>
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">{"Loại sản phẩm"}</span>
                <span className="text-sm">{data?.data?.category || "-"}</span>
              </li>
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">{"Brand"}</span>
                <span className="text-sm">{data?.data?.brand || "--"}</span>
              </li>
            </ul>
            <ul className="grid gap-2">
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">{"Tags"}</span>
                <span className="text-sm">{data?.data?.tags || "-"}</span>
              </li>
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">{"Creation Date"}</span>
                <span className="text-sm">
                  {data?.data?.created_on
                    ? format(data?.data.created_on, "dd/MM/yyyy HH:mm")
                    : "-"}
                </span>
              </li>
              <li className="flex items-center justify-between gap-7">
                <span className="text-muted-foreground">
                  {"Last Update Date"}
                </span>
                <span className="text-sm">
                  {data?.data?.modified_on
                    ? format(data?.data.modified_on, "dd/MM/yyyy HH:mm")
                    : "-"}
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="w-full flex flex-row gap-2">
        <div className="flex-[0.4] flex">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex-[0.3] flex flex-col gap-2">
                {data?.data?.variants.map((value, index) => {
                  const selected =
                    value.id.toString() === queryParams.variantId ||
                    (!queryParams.variantId && index === 0);
                  return (
                    <div
                      onClick={() =>
                        setQueryParams({ variantId: value.id.toString() })
                      }
                      className={cn(
                        "rounded-sm p-2 cursor-pointer bg-muted",
                        selected && `bg-secondary text-white font-medium`
                      )}
                      key={index}
                    >
                      <div>{value.opt1 || value.unit}</div>
                      <div>{`On hands: ${value.inventories[0].on_hand}`}</div>
                      <div>{`Available: ${value.inventories[0].available}`}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-[0.6] flex flex-col gap-2">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <label className="font-bold">{"Conversion Details"}</label>
                <div>
                  <ul className="grid gap-2">
                    <li className="flex items-center justify-between gap-7">
                      <span className="text-muted-foreground">
                        {"Conversion Name"}
                      </span>
                      <span className="text-sm">
                        {selectedVariant?.name || "-"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-7">
                      <span className="text-muted-foreground">{"SKU"}</span>
                      <span className="text-sm">
                        {selectedVariant?.sku || "-"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-7">
                      <span className="text-muted-foreground">{"Unit"}</span>
                      <span className="text-sm">
                        {selectedVariant?.unit || "--"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-7">
                      <span className="text-muted-foreground">{"Barcode"}</span>
                      <span className="text-sm">
                        {selectedVariant?.barcode || "--"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-7">
                      <span className="text-muted-foreground">
                        {"Conversion Quantity"}
                      </span>
                      <span className="text-sm">
                        {selectedVariant?.packsize_quantity || "--"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <label className="font-bold">{"Product Price"}</label>
                <div>
                  <ul className="grid gap-2">
                    {selectedVariant?.variant_prices?.map((value, index) => {
                      return (
                        <li className="flex items-center justify-between gap-7">
                          <span className="text-muted-foreground">
                            {value.name}
                          </span>
                          <span className="text-sm">{value.value || "-"}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
