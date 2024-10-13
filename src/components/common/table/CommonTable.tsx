"use client";

import {
  CommonNewToolbar,
  Row as RowToolbar,
  TypeDropdown,
} from "./CommonNewToolbar";
import { DataTablePagination } from "./CommonPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

interface DataTableProps<TData, TValue> {
  isLoading: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  setPagination?: OnChangeFn<PaginationState>;
  filterComponent?: React.ReactNode;
  extraActionTable?: RowToolbar[];
  onCallbackExtraActionTable?: ({
    type,
    selected,
    data,
  }: {
    type: TypeDropdown;
    selected: RowSelectionState;
    data: any;
  }) => void;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  onClickRow?: (row: Row<TData>) => void;
}

export function CommonTable<TData, TValue>({
  filterComponent,
  extraActionTable,
  onCallbackExtraActionTable,
  isLoading = false,
  columns,
  data,
  pageCount = 0,
  pageIndex,
  pageSize = 20,
  setPagination,
  renderSubComponent,
  getRowCanExpand,
  onClickRow,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize,
      },
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowCanExpand,
  });

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <Loader2Icon
            strokeWidth={1}
            className="animate-spin"
            width={48}
            height={48}
          />
        </div>
      );
    }
    return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <TableRow key={i}>
                {headerGroup.headers.map((header, j) => {
                  return (
                    <TableHead key={j}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <React.Fragment>
                  <TableRow
                    key={index}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-12 py-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickRow?.(row);
                    }}
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <TableCell key={i}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row?.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        {renderSubComponent?.({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 py-4 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-4 h-full">
      {extraActionTable && (
        <CommonNewToolbar
          setPagination={setPagination}
          filterComponent={filterComponent || <></>}
          rows={extraActionTable}
          onCallbackSelection={(type) => {
            onCallbackExtraActionTable?.({
              type,
              selected: rowSelection,
              data: table.getSelectedRowModel().rows.map((e) => e.original),
            });
            table.resetRowSelection();
          }}
          rowSelection={rowSelection}
        />
      )}
      {renderTable()}
      {!!pageCount && <DataTablePagination table={table} />}
    </div>
  );
}
