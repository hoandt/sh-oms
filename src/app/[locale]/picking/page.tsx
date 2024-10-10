"use client";
import React, { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createLogs, deleteLogs, getLogs, updateLogs } from "@/services";
import { WMSLog, WMSPromotion, WMSPromotions } from "@/types/todo";

import { DURATION_TOAST } from "@/lib/config";
import { useToast } from "@/components/ui/use-toast";

import PickingBarcodeScanner from "./components/PickingBarcodeScanner";
import { getPromotions } from "@/services/getPromotions";

const Page = () => {
  const [isBarcodeFocused, setIsBarcodeFocused] = useState<boolean>(false);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession() as any;
  const [currentUser, setCurrentUser] = useState<UserWithRole>();
  const [log, setLog] = useState<VideosLog[]>([]);
  const [transactions, setTransactions] = useState<WMSLog[]>([]);
  const [promotions, setPromotions] = useState<WMSPromotion[]>([]);

  const [prevOrgId, setPrevOrgId] = useState("");

  useEffect(() => {
    // Focus on barcode scanner input
    setIsBarcodeFocused(true);

    if (session.data) {
      const user = session.data.userWithRole as UserWithRole;
      setCurrentUser(user);

      // Check if the organization ID has changed
      if (prevOrgId !== user.organization.id.toString()) {
        setPrevOrgId(user.organization.id.toString()); // Update the previous organization ID

        getPromotions({
          organization: user.organization.id.toString(),
        }).then((data) => {
          setPromotions(data.data[0].attributes.promotion);
        });
      }
    }
  }, [session, prevOrgId]);

  const mutateTransaction = useMutation({
    mutationFn: (logs: any) => {
      return createLogs({ logs });
    },
    onSuccess(data, __, _) {
      const newData = (data.data as any).data as VideosLog;

      setLog((prev) => [newData, ...prev]);
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
            <div className="my-2 flex gap-5">
              <PickingBarcodeScanner promotions={promotions} />
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
