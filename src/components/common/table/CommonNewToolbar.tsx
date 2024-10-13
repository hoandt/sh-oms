"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Option } from "@/types/common";
import qs from "qs";
import { useFilterStore } from "@/lib/store";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { DURATION_TOAST } from "@/lib/config";
import { useQueryClient } from "@tanstack/react-query";

import { format, parseISO } from "date-fns";
import { inventoryQueryKeys } from "@/query-keys";
import { IBrandsSapo, ICategorySapo } from "@/types/inventories";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Array<Option>;
}

export type TypeDropdown = "DELETE" | "CONFIRM";

export interface Row {
  label: string;
  value: TypeDropdown;
}

interface DataTableToolbarProps<TData> {
  rows: Array<Row>;
  rowSelection: RowSelectionState;
  onCallbackSelection(type: TypeDropdown): void;
  filterComponent: React.ReactNode;
  setPagination?: OnChangeFn<PaginationState>;
}

export const schema = z.object({
  name: z.string().optional(),
  selectedFilterId: z.string().optional(),
});

const enum TypeFilter {
  NEW = "NEW",
  EXIST = "EXIST",
}

const SavedFilterComponent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(TypeFilter["NEW"]);
  const { filter, addFilter, updateFilter } = useFilterStore();
  const specificFilter = filter.filter((e) => e.page.includes(pathname))[0];

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  return <></>;
};

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "dd/MM/yyyy");
};

function mappingFilter(
  filterList: [
    string,
    string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined
  ][]
) {
  const queryClient = useQueryClient();
  let processedFilters = [];
  let fromDate = "";
  let toDate = "";

  const dataBrand = queryClient.getQueryData(
    inventoryQueryKeys.getBrandSapo({
      page: 1,
      query: "",
      status: "active",
    })
  ) as { data: IBrandsSapo[] };

  const dataCategory = queryClient.getQueryData(
    inventoryQueryKeys.getCategorySapo({
      page: 1,
      query: "",
      status: "active",
    })
  ) as { data: ICategorySapo[] };

  filterList.forEach((filter) => {
    const [key, value] = filter;
    if (key === "created_on_min") {
      fromDate = formatDate(value as string);
    } else if (key === "created_on_max") {
      toDate = formatDate(value as string);
    } else if (key === "brand_ids") {
      const findBrand = dataBrand?.data.find(
        (e) => e.id === Number(value as string)
      );
      processedFilters.push({
        key,
        label: "Nhãn hiệu",
        value: findBrand?.name || "-",
      });
    } else if (key === "category_ids") {
      const findCategory = dataCategory?.data.find(
        (e) => e.id === Number(value as string)
      );
      processedFilters.push({
        key,
        label: "Loại sản phẩm",
        value: findCategory?.name || "-",
      });
    }
  });

  if (fromDate && toDate) {
    processedFilters.push({
      key: "date_range",
      label: "Date",
      value: `Từ ${fromDate} đến ${toDate}`,
    });
  }

  return processedFilters;
}

export function CommonNewToolbar<TData>({
  filterComponent,
  onCallbackSelection,
  rowSelection,
  rows,
  setPagination,
}: DataTableToolbarProps<TData>) {
  const inputRef = useRef<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const isShowSubComponent = Object.keys(rowSelection).length;
  const originalRows = [
    { label: "Bulk Delete", value: "DELETE" },
  ] as Array<Row>;

  function onSearch() {
    const val = inputRef.current?.value;
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }

    setPagination({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });
    router.replace(`${pathname}?${params.toString()}`);
  }

  const filterList = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.delete("status");

    const arraySearchParams = qs.parse(params.toString());
    return Object.entries(arraySearchParams);
  }, [searchParams]);

  function removeQueryParams(fields: string[]) {
    const params = new URLSearchParams(searchParams);
    fields.map((e) => {
      params.delete(e);
    });
    router.replace(`${pathname}?${params.toString()}`);
  }

  function onRemove() {
    inputRef.current.value = "";
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-2 p-2 mt-2">
      <div className="flex h-8 items-center w-full justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row h-8 w-[150px] px-0 pr-2 py-4 rounded-xl items-center lg:w-[250px] border-red-100 border">
            <Input
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              key={searchParams?.get("q")}
              placeholder={`Searching...`}
              defaultValue={searchParams.get("q")?.toString()}
              className="border-0 bg-transparent focus-visible:ring-0 shadow-none rounded-none"
            />
            {(!!inputRef.current?.value.length || !!keyword.length) && (
              <div
                onClick={onRemove}
                className="cursor-pointer rounded-full h-4 w-4 rounded-1/2 bg-neutral-950 flex justify-center items-center"
              >
                <XIcon color="white" height={8} width={8} />
              </div>
            )}
          </div>
          <Button className="h-8" onClick={onSearch}>
            Search
          </Button>
        </div>

        <div className="flex flex-row gap-2">
          {filterComponent && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Filters</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                {filterComponent}
              </SheetContent>
            </Sheet>
          )}

          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Bộ lọc đã lưu</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
              <SheetHeader>
                <SheetTitle>Bộ lọc đã lưu</SheetTitle>
              </SheetHeader>
              <SavedFilterSheet />
            </SheetContent>
          </Sheet> */}

          {!!isShowSubComponent && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Action More</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuGroup>
                  {originalRows.concat(rows)?.map((row, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => onCallbackSelection(row.value)}
                    >
                      {row.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {mappingFilter(filterList).map((filter, index) => {
          return (
            <Badge
              key={index}
              onClick={() => {
                if (filter.key === "date_range") {
                  removeQueryParams(["created_on_max", "created_on_min"]);
                } else {
                  removeQueryParams([filter.key]);
                }
              }}
              className="cursor-pointer px-4 py-2 flex gap-2 hover:bg-primary"
            >
              <div className="flex flex-row gap-1">
                <div className="font-bold">{`${filter.label}:`}</div>
                <div className="font-bold">{`${filter.value}`}</div>
              </div>
              <XIcon width={12} height={12} />
            </Badge>
          );
        })}
        {!!filterList.length && <SavedFilterComponent />}
      </div>
    </div>
  );
}
