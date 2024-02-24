"use client";
import React, { use, useEffect, useMemo, useState } from "react";
import BarcodeScanForm from "./components/BarcodeScanner";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLogs, deleteLogs, transformData } from "@/services";
import { useGetLogs } from "@/query-keys/logs/query";
import { ColumnDef } from "@tanstack/react-table";
import { WMSLog } from "@/types/todo";
import { CommonTable } from "@/components/common/table/CommonTable";
import { format } from "date-fns";
import { Button } from "@/components/Button";
import Link from "next/link";
import { logQueryKeys } from "@/query-keys/logs/key";
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
import { DURATION_TOAST } from "@/lib/config";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const { toast } = useToast();
  const session = useSession() as any;
  const [user, setUser] = useState<string>("");
  const [log, setLog] = useState<WMSLog[]>([]);

  useEffect(() => {
    if (session.data) {
      const user = session.data.userWithRole as UserWithRole;
      setUser(user.firstName + " " + user.lastName);
    }
  }, [session]);

  const hasViewMore = log.length > 20;

  const mutateTransaction = useMutation({
    mutationFn: (logs: any) => {
      return createLogs({ logs });
    },
    onSuccess(data, __, _) {
      const newData = (data.data as any).data as WMSLog;
      setLog((prev) => [...prev, newData]);
    },
  });

  const mutateDeleteTransaction = useMutation({
    mutationFn: (id: number) => {
      return deleteLogs({ id });
    },
    onSuccess: (data) => {
      const returnData = (data.data as any).data;
      const newData = log.filter((e) => e.id !== returnData.id);

      toast({
        duration: DURATION_TOAST,
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });

      return setLog(newData);
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
        header: () => <div className="">{"Trạng thái"}</div>,
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
        cell: ({ row }) => <div>{row.getValue("user") || "-"}</div>,
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
                    mutateDeleteTransaction.mutate(row.original.id as number);
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

  const handleScan = (code: string) => {
    mutateTransaction.mutate({
      transaction: code,
      type: "outbound",
      status: "packing",
      user: 1,
    });
  };

  return (
    <div className="-mt-32 ">
      {/* Add padding-top equivalent to the height of your sticky header */}
      <div className="grid grid-cols-6">
        {/* Sidebar */}
        <div className="bg-slate-200 h-screen col-span-1 pt-32">
          <div className="p-4">
            <BarcodeScanForm
              handleScan={handleScan}
              isLoading={mutateTransaction.isPending}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-5 pt-32">
          <div className="p-4 ">
            <h1 className="text-2xl text-gray-800">Tracking mã đơn</h1>

            <CommonTable
              filterComponent={null}
              data={log || []}
              columns={columns}
              isLoading={false}
            />

            {hasViewMore && (
              <div className="w-full flex justify-center mt-2">
                <Button>
                  <Link href={"/wms-logs/history"}>{"View All"}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
