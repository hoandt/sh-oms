"use client";

import { RowSelectionState } from "@tanstack/react-table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData> extends DataTableSearchableColumn<TData> {
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
}

export function CommonNewToolbar<TData>({
  filterComponent,
  onCallbackSelection,
  rowSelection,
  rows,
}: DataTableToolbarProps<TData>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const isShowSubComponent = Object.keys(rowSelection).length;
  const originalRows = [{ label: "Bulk Delete", value: "DELETE" }] as Array<Row>;

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-row justify-between gap-2 p-2">
      <div className="flex items-center justify-between">
        <Input
          key={searchParams?.get("q")}
          className="h-8 w-[150px] lg:w-[250px]"
          defaultValue={searchParams.get("q")?.toString()}
          onChange={handleChangeInput}
          placeholder="Searching..."
        />
      </div>

      <div className="flex flex-row gap-2">
        {filterComponent && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Bộ lọc</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Bộ lọc</SheetTitle>
              </SheetHeader>
              {filterComponent}
            </SheetContent>
          </Sheet>
        )}

        {!!isShowSubComponent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Action More</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuGroup>
                {originalRows.concat(rows)?.map((row, index) => (
                  <DropdownMenuItem key={index} onClick={() => onCallbackSelection(row.value)}>
                    {row.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
