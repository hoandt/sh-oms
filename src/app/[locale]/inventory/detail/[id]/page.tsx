"use client";
import { BackButton } from "@/components/common/custom/BackButton";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  useGetInventoryDetailBySapo,
  useGetInventoryTransactionBySapo,
} from "@/query-keys";
import { CompositeItem, IVariantInventory, Variant } from "@/types/inventories";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";
import LotInventory from "../../components/LotInventory";
import { ChevronDown } from "lucide-react";

enum INVENTORY_STATUS_PARAMS {
  INVENTORY = "Inventory",
  TRANSACTION = "Transaction",
  COMPOSITE = "Composite",
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
  {
    label: "Composite",
    value: INVENTORY_STATUS_PARAMS.COMPOSITE,
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

  const composites =
    data?.data?.product_type === "composite"
      ? data.data.variants[0].composite_items
      : [];

  const lots_date = data?.data?.product_type === "lots_date";
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
        accessorKey: "date",
        header: () => <div>Date</div>,
        cell: ({ row }) => {
          const utcDate = row.original.issued_at_utc;
          //convert to local date time with timezone
          const localDate = new Date(utcDate);
          //timezone with local from browser
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          // Format the date to the specified timezone with correct DateTimeFormatOptions
          const options = {
            timeZone: timeZone,
            timeZoneName: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };

          const formatter = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            // dd/MM/yyyy HH:mm
          });
          const formattedLocalDate = formatter.format(localDate);
          return <div>{formattedLocalDate}</div>;
        },
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>Action</div>,
        cell: ({ row }) => <div>{row.original.log_type_name}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "onhand_adj",
        header: () => <div>{"Changes"}</div>,
        cell: ({ row }) => <div>{row.original.onhand_adj}</div>,
        enableSorting: false,
      },
      // {
      //   accessorKey: "onhand",
      //   header: () => <div>{"On hands"}</div>,
      //   cell: ({ row }) => <div>{row.original.onhand}</div>,
      //   enableSorting: false,
      // },

      {
        accessorKey: "log_root_id",
        header: () => <div>{"Ref"}</div>,
        cell: ({ row }) => <div>{row.original.trans_object_code}</div>,
        enableSorting: false,
      },
    ] as ColumnDef<IVariantInventory>[];
  }, []);

  const columnsVariantInventory = useMemo(() => {
    return [
      // {
      //   accessorKey: "on_hand",
      //   header: () => <div>{"On hands"}</div>,
      //   cell: ({ row }) => (
      //     <div className="flex">
      //       {/* {lots_date && <ChevronDown />}{" "} */}
      //       <div className="w-full">
      //         {row.original.on_hand}
      //         {/* {lots_date && <LotInventory />} */}
      //       </div>
      //     </div>
      //   ),
      //   enableSorting: false,
      // },

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
    ] as ColumnDef<any>[];
  }, []);

  const columnsComposite = useMemo(() => {
    return [
      {
        accessorKey: "sub_name",
        header: () => <div>{"Name"}</div>,
        cell: ({ row }) => <div>{row.original.sub_name}</div>,
        enableSorting: false,
      },

      {
        accessorKey: "sub_sku",
        header: () => <div>{"SKU"}</div>,
        cell: ({ row }) => <div>{row.original.sub_sku || 0}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: () => <div>{"Quantity"}</div>,
        cell: ({ row }) => <div>{row.original.quantity}</div>,
        enableSorting: false,
      },
    ] as ColumnDef<CompositeItem>[];
  }, []);

  const onSelect = (option: string) => {
    setQueryParams({ status: option });
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <BackButton
          onClick={() => {
            router.push("/inventory");
          }}
        />
        <h1 className="text-xl font-bold">{data?.data.name}</h1>
        <p className="text-lg text-gray-400"> {selectedVariant?.sku}</p>
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
                  // if composite, hide the tab transaction
                  if (
                    option.value === INVENTORY_STATUS_PARAMS.TRANSACTION &&
                    data?.data.product_type === "composite"
                  ) {
                    return null;
                  }
                  if (
                    option.value === INVENTORY_STATUS_PARAMS.COMPOSITE &&
                    data?.data.product_type === "normal"
                  ) {
                    return null;
                  }
                  return (
                    <TabsTrigger key={index} value={option.value}>
                      {option.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {queryParams.status === INVENTORY_STATUS_PARAMS.INVENTORY && (
              <CommonTable
                columns={columnsVariantInventory}
                data={selectedVariant?.inventories || []}
                isLoading={false}
              />
            )}
            {queryParams.status === INVENTORY_STATUS_PARAMS.TRANSACTION && (
              <CommonTable
                columns={columns}
                data={reports?.data || []}
                isLoading={isLoadingReports}
              />
            )}
            {queryParams.status === INVENTORY_STATUS_PARAMS.COMPOSITE &&
              composites && (
                <CommonTable
                  columns={columnsComposite}
                  data={composites}
                  onClickRow={(row) => {
                    //push to detail page
                    window.location.href = `/inventory/detail/${row.original.sub_product_id}?variantId=${row.original.sub_variant_id}`;
                  }}
                  isLoading={false}
                />
              )}
          </Tabs>
        </CardContent>
      </Card>

      <div className="  flex  gap-2">
        <Card className="w-full">
          <CardContent className="mt-4 space-y-4">
            <div className="flex flex-row justify-between gap-2">
              <ul className="grid gap-2">
                <li className="flex items-center justify-between gap-7">
                  <span className="text-muted-foreground">Type </span>
                  <span className="text-sm">
                    {data?.data?.product_type || "-"}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-7">
                  <span className="text-muted-foreground">{"Shipper"}</span>
                  <span className="text-sm">{data?.data?.category || "-"}</span>
                </li>
              </ul>
              <ul className="grid gap-2">
                <li className="flex items-center justify-between gap-7">
                  <span className="text-muted-foreground">{"Created at"}</span>
                  <span className="text-sm">
                    {data?.data?.created_on
                      ? format(data?.data.created_on, "dd/MM/yyyy HH:mm")
                      : "-"}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-7">
                  <span className="text-muted-foreground">
                    {"Last updated at"}
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

        <div className=" flex w-full gap-2">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <label className="font-bold">{"Details"}</label>
                <div>
                  <ul className="grid gap-2">
                    <li className="flex items-center justify-between gap-7">
                      <span className="text-muted-foreground">Item name</span>
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
                      <span className="text-muted-foreground">{"Barcode"}</span>
                      <span className="text-sm">
                        {selectedVariant?.barcode || "--"}
                      </span>
                    </li>
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
