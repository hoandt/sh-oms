"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createLogs, deleteLogs, getLogs, updateLogs } from "@/services";
import { WMSLog } from "@/types/todo";

import { DURATION_TOAST } from "@/lib/config";
import { useToast } from "@/components/ui/use-toast";

import PickingBarcodeScanner from "./components/PickingBarcodeScanner";

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

        <div className="sm:col-span-6 pt-32">
          <div className="p-4 ">
            <h1 className="text-2xl text-slate-600 flex font-bold ">
              Nhặt hàng
            </h1>
            <div className="my-2">
              <PickingBarcodeScanner />
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
          </div>
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
