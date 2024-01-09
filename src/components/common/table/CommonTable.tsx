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
  filterComponent: React.ReactNode;
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
        <div className="flex items-center justify-center">
          <Loader2Icon
            strokeWidth={1}
            className="animate-spin"
            width={52}
            height={52}
          />
        </div>
      );
    }
    return (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
            table.getRowModel().rows.map((row) => (
              <React.Fragment>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-4">
      {extraActionTable && (
        <CommonNewToolbar
          filterComponent={filterComponent}
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
      <div className="rounded-md border">{renderTable()}</div>
      {!!pageCount && <DataTablePagination table={table} />}
    </div>
  );
}
