"use client";
import React, { use, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useGetLogs } from "@/query-keys/logs/query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { SystemInventory, WMSLog } from "@/types/todo";
import { CommonTable } from "@/components/common/table/CommonTable";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { deleteLogs } from "@/services";
import { Button } from "@/components/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2Icon } from "lucide-react";
type TrackingCodeLine = {
  code: string;
  startTime: string;

  user: string;
};
const page = () => {
  const session = useSession() as any;
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });

  const {
    data: logs,
    isLoading,
    refetch,
  } = useGetLogs({
    page: pageIndex,
    pageSize,
    code: keyword,
  });

  const mutateDeleteTransaction = useMutation({
    mutationFn: (id: number) => {
      return deleteLogs({ id });
    },
    onSuccess: (data) => {
      refetch();
    },
  });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "status",
        header: () => <div className="">{"Transaction"}</div>,
        cell: ({ row }) => {
          const transaction = row.original.attributes.transaction;
          return <div className="flex space-x-2">{transaction}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "priority",
        header: () => <div className="">{"Status"}</div>,
        cell: ({ row }) => {
          const status = row.original.attributes.status;
          return <div>{status}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Ngày đóng gói"}</div>,
        cell: ({ row }) => {
          const date = row.original.attributes.createdAt;
          return <div>{format(date, "HH:mm dd/MM/yyyy")}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "user",
        header: () => <div className="">{"Nhân viên đóng gói"}</div>,
        cell: ({ row }) => {
          const user = row.original.attributes.user;
          return <div>{user}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "actions",
        header: () => <div className="">{"Hành Động"}</div>,
        cell: ({ row }) => (
          <AlertDialog>
            <AlertDialogTrigger
              className="text-center text-sm leading-6 text-gray-500"
              asChild
            >
              <Button className="flex gap-2">
                {"Xoá"}
                {mutateDeleteTransaction.isPending && (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    mutateDeleteTransaction.mutate(row.original.id);
                  }}
                >
                  {mutateDeleteTransaction.isPending && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<WMSLog>[];
  }, []);

  return (
    <CommonTable
      extraActionTable={[]}
      filterComponent={null}
      data={(logs?.data as WMSLog[]) || []}
      columns={columns}
      isLoading={isLoading}
      setPagination={setPagination}
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={
        Math.ceil((logs?.meta?.pagination?.total || 0) / pageSize) || 1
      }
    />
  );

  return null;
};

export default page;
