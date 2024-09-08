"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createLogs, deleteLogs, getLogs, updateLogs } from "@/services";
import { WMSLog } from "@/types/todo";
import { format } from "date-fns";
import Link from "next/link";

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
import { Trash2Icon } from "lucide-react";
import { DURATION_TOAST } from "@/lib/config";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { toInteger } from "lodash";
import { cn } from "@/lib/utils";

import BarcodeScanForm from "../components/BarcodeScanner";
import PostsList from "@/components/common/custom/PostList";

const Page = () => {
  const [isBarcodeFocused, setIsBarcodeFocused] = useState<boolean>(false);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession() as any;
  const [currentUser, setCurrentUser] = useState<UserWithRole>();
  const [log, setLog] = useState<VideosLog[]>([]);
  const [transactions, setTransactions] = useState<WMSLog[]>([]);

  const mutateUpdateLog = useMutation({
    mutationFn: ({ id, videoUrl }: { id: number; videoUrl: string }) => {
      return updateLogs({ id, videoUrl });
    },
    onSuccess: (data: any) => {
      // Handle success if needed
    },
  });

  useEffect(() => {
    //focus on barcode scanner input
    setIsBarcodeFocused(true);
    if (session.data) {
      const user = session.data.userWithRole as UserWithRole;

      setCurrentUser(user);
    }
  }, [session]);

  const mutateTransaction = useMutation({
    mutationFn: (logs: any) => {
      return createLogs({ logs });
    },
    onSuccess(data, __, _) {
      const newData = (data.data as any).data as VideosLog;

      setLog((prev) => [newData, ...prev]);
    },
  });

  const mutateDeleteTransaction = useMutation({
    mutationFn: (id: number) => {
      return deleteLogs({ id });
    },
    onSuccess: (data: any) => {
      const returnData = (data.data as any).data;
      const newData = log.filter((e) => e.id !== returnData.id);

      toast({
        duration: DURATION_TOAST,
        title: "Đã xóa",
        description: `Giao dịch ${JSON.stringify(
          data.data.data.attributes.transaction
        )} đã được xóa!`,
      });
      setLog(newData);
    },
  });

  const handleScan = (code: string) => {
    // Fetch existing logs by organization and code
    getLogs({
      organization: currentUser!.organization.id.toString(),
      code: code,
      status: "outbound",
    }).then((data) => {
      if (data.data.length > 0) {
        // If transaction exists, set transactions and open the dialog
        setTransactions(data.data);
        setIsDialogOpen(true);
      } else {
        // If no existing transaction, create a new one
        mutateTransaction.mutate({
          organization: currentUser?.organization.id,
          transaction: code,
          type: "outbound",
          status: "handover",
          user: `${currentUser?.id}`,
        });
      }
    });
  };

  return (
    <div className="-mt-32 ">
      {/* Add padding-top equivalent to the height of your sticky header */}
      <div className="grid grid-cols-6">
        {/* Main Content */}

        <div className="sm:col-span-4 pt-32">
          <div className="p-4 ">
            <h1 className="text-2xl text-slate-600 flex font-bold ">
              Bàn giao
            </h1>
            <div className="my-2">
              <BarcodeScanForm
                handleScan={handleScan}
                isFocused={isBarcodeFocused}
                isLoading={mutateTransaction.isPending}
              />
            </div>
            {/* make a button inline */}
            {/* View all transaction button  */}
            <div className="flex justify-between mb-2 w-full">
              <h2 className="  text-slate-500">
                {"Nhân viên: "}
                <span className="text-slate-800">
                  {currentUser?.lastName} {currentUser?.firstName}
                </span>
              </h2>
            </div>

            {/* Display a simple table show recent log, if log is empty, display placeholder message */}
            {log.length > 0 ? (
              <table className="w-full bg-white rounded border px-2">
                <thead>
                  <tr className="px-2 py-4 text-sm">
                    <th className="text-left px-2 py-3">STT</th>
                    <th className="text-left px-2 py-3">Mã đơn</th>
                    <th className="text-left px-2 py-3">Nhân viên</th>
                    <th className="text-left px-2 py-3">Thời gian bàn giao</th>
                  </tr>
                </thead>
                <tbody>
                  {log.slice(0, 10).map((l, i) => {
                    return (
                      <tr
                        key={l.id}
                        className={cn(
                          //  even odd row color
                          i % 2 === 0 ? "bg-slate-50" : "bg-slate-200",
                          "px-2"
                        )}
                      >
                        <td className="px-3">{i + 1}</td>
                        <td className="px-3 py-2">
                          <Link
                            target="_blank"
                            href={`/history?q=${l.attributes.transaction}`}
                            className={cn(
                              "text-gray-800 bold hover:underline cursor-pointer inline-flex items-center gap-2"
                            )}
                          >
                            {l.attributes.transaction}
                          </Link>
                        </td>
                        <td className="px-3 py-2">
                          {currentUser?.lastName} {currentUser?.firstName}
                        </td>
                        <td className="px-3 py-2">
                          {format(
                            new Date(l.attributes.createdAt),
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </td>

                        <td className="px-3 py-2">
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button variant="outline">
                                <Trash2Icon className="w-5 " />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {"Xác nhận xóa"}
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogDescription>
                                {"Bạn có chắc chắn muốn xóa giao dịch này?"}
                              </AlertDialogDescription>
                              <AlertDialogFooter>
                                <AlertDialogAction
                                  onClick={() => {
                                    mutateDeleteTransaction.mutate(
                                      toInteger(l.id)
                                    );
                                    setIsBarcodeFocused((prev) => !prev);
                                  }}
                                >
                                  {"Xóa"}
                                </AlertDialogAction>
                                <AlertDialogCancel>{"Hủy"}</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-600"></p>
              </div>
            )}
            {/* if log.length > 5 display fade to indcated more */}
            {log.length > 15 && (
              <div
                className="flex justify-center items-center
              -mt-2
              bg-gradient-to-t from-white to-transparent h-12"
              >
                <p className="text-gray-600">...</p>
              </div>
            )}
          </div>
        </div>
        <div className="sm:col-span-2 py-32 bg-slate-50 px-2 flex-1 h-screen">
          <PostsList />
          {transactions.length > 0 && (
            //  display popup to show transaction detail
            <AlertDialog open={isDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{"Đơn hàng đã bàn giao"}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 w-full">
                      {/* display txn, datetime, user and delete */}
                      <div className="flex-1 flex gap-1">
                        <p className="text-gray-800">
                          {t.attributes.transaction} <br />
                          <span className="text-gray-500">
                            Station: {t.attributes.user}
                          </span>
                        </p>

                        <p className="text-gray-800">
                          {" "}
                          vào lúc:{" "}
                          {format(
                            new Date(t.attributes.createdAt),
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => {
                          mutateDeleteTransaction.mutate(toInteger(t.id));
                          setIsBarcodeFocused((prev) => !prev);
                          setIsDialogOpen((prev) => !prev);
                        }}
                      >
                        <Trash2Icon className="w-5 " />
                      </Button>
                    </div>
                  ))}
                </AlertDialogDescription>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setIsDialogOpen((prev) => !prev);
                      setIsBarcodeFocused((prev) => !prev);
                    }}
                  >
                    {"Hủy"}
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
// create type extends WMSLog to keep track uploaded video progress
type VideosLog = WMSLog & {
  videoUrl?: string;
  isUploading?: boolean;
};
