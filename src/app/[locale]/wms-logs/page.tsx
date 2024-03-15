"use client";
import React, { useEffect, useRef, useState } from "react";
import BarcodeScanForm from "./components/BarcodeScanner";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createLogs, deleteLogs, updateLogs } from "@/services";
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
import { Router, Trash2Icon } from "lucide-react";
import { DURATION_TOAST } from "@/lib/config";
import { useToast } from "@/components/ui/use-toast";

import SelectCameraDevice from "./components/Webcam";
import CameraRecorder from "./components/VideoRecord";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toInteger } from "lodash";
import { cn } from "@/lib/utils";
import Timer from "./components/Timer";
import { VideoUploadResponse } from "@api.video/video-uploader";
import Chunked from "./components/Chunks";

type CameraAction = "start" | "stop" | "idle";
export type CameraActionPayload = {
  deviceId: string;
  action: CameraAction;
  trackingCode: string;
  log: WMSLog[];
};
const Page = () => {
  const [scanActive, setScanActive] = useState<boolean>(false);
  const [isBarcodeFocused, setIsBarcodeFocused] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();
  const finishRecordBtn = useRef<HTMLButtonElement | undefined>();

  const session = useSession() as any;
  const [currentUser, setCurrentUser] = useState<UserWithRole>();
  const [log, setLog] = useState<WMSLog[]>([]);
  const [video, setVideo] = useState<VideoUploadResponse>();
  const [cameraAction, setCameraAction] = useState<CameraActionPayload>({
    deviceId: "",
    action: "idle",
    trackingCode: "",
    log,
  });
  const mutateUpdateLog = useMutation({
    mutationFn: ({ id, videoUrl }: { id: number; videoUrl: string }) => {
      return updateLogs({ id, videoUrl });
    },
    onSuccess: (data: any) => {
      // Handle success if needed
    },
  });
  useEffect(() => {
    if (session.data) {
      const user = session.data.userWithRole as UserWithRole;
      setCurrentUser(user);
    }
  }, [session]);
  useEffect(() => {
    cameraAction.action === "start" && finishRecordBtn.current?.focus();
    finishRecordBtn.current?.focus();
  }, [log, cameraAction.action]);
  useEffect(() => {
    // find log that has the same tracking code with the video title,update the videoUrl
    if (video) {
      const trackingCode = video.title;
      const foundLog = log.find(
        (l) => (l.attributes as any).transaction === trackingCode
      );
      foundLog?.id &&
        video.assets &&
        mutateUpdateLog.mutate({
          id: toInteger(foundLog.id),
          videoUrl: video.assets?.mp4 || "",
        });
    }
  }, [video, log]);
  useEffect(() => {
    setIsBarcodeFocused(true);
  }, [cameraAction]);

  const hasViewMore = log.length > 7;

  const mutateTransaction = useMutation({
    mutationFn: (logs: any) => {
      return createLogs({ logs });
    },
    onSuccess(data, __, _) {
      const newData = (data.data as any).data as WMSLog;
      setCameraAction({ ...cameraAction, log: [newData, ...log] });
      setLog((prev) => [newData, ...prev].slice(0, 8));
    },
  });
  const handleUploading = (status: boolean, video?: VideoUploadResponse) => {
    setIsUploading(status);
    setVideo(video);
  };
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
  const handleRecordComplete = () => {
    setCameraAction({ ...cameraAction, action: "stop" });
    setIsBarcodeFocused((prev) => !prev);
  };

  const handleScan = (code: string) => {
    mutateTransaction.mutate({
      organization: currentUser?.organization.id,
      transaction: code,
      type: "outbound",
      status: "packed",
      user: 1,
    });
    setCameraAction({ ...cameraAction, trackingCode: code, action: "start" });
  };

  return (
    <div className="-mt-32 ">
      {/* Add padding-top equivalent to the height of your sticky header */}
      <div className="grid grid-cols-6">
        {/* Sidebar */}
        <div className="bg-slate-200 h-screen col-span-6 sm:col-span-3 pt-32">
          <div className="p-4">
            {scanActive && (
              <BarcodeScanForm
                handleScan={handleScan}
                isFocused={isBarcodeFocused}
                isLoading={mutateTransaction.isPending}
              />
            )}
            {cameraAction.deviceId && (
              <>
                <div className="rounded shadow my-2">
                  <CameraRecorder
                    action={cameraAction}
                    handleStream={(status: boolean) => {
                      setScanActive(status);
                    }}
                    handleUploading={(
                      status: boolean,
                      video: VideoUploadResponse | undefined
                    ) => handleUploading(status, video)}
                  />
                </div>
              </>
            )}
            <SelectCameraDevice
              handleSelect={(device: string) => {
                setCameraAction({ ...cameraAction, deviceId: device });
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 sm:col-span-3 pt-32">
          <div className="p-4 ">
            <h1 className="text-2xl text-slate-600 flex font-bold ">
              Tracking mã đơn{" "}
              {isUploading && (
                <Router
                  strokeWidth={3}
                  className="animate-pulse text-orange-500 w-8"
                />
              )}
            </h1>
            {/* make a button inline */}

            {/* View all transaction button  */}
            <div className="flex justify-between mb-2">
              <h2 className="  text-slate-500">
                {"Nhân viên: "}
                <span className="text-slate-800">
                  {currentUser?.lastName} {currentUser?.firstName}
                </span>
              </h2>
              <Button>
                <Link href={"/history"}>{"Xem toàn bộ"}</Link>
              </Button>
            </div>
            {/* Display a simple table show recent log, if log is empty, display placeholder message */}
            {log.length > 0 ? (
              <table className="w-full bg-white rounded border px-2">
                <thead>
                  <tr className="px-2 py-4">
                    <th className="text-left px-2 py-3 ">STT</th>
                    <th className="text-left px-2 py-3">Mã đơn</th>
                    <th className="text-left px-2 py-3">Nhân viên</th>
                    <th className="text-left px-2 py-3">Thời gian</th>
                    <th className="text-left px-2 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((l, i) => {
                    return (
                      <tr
                        key={l.id}
                        className={cn(
                          //  even odd row color
                          i % 2 === 0 ? "bg-slate-50" : "bg-slate-200",
                          "px-2"
                        )}
                      >
                        <td className="px-3">{log.length - i}</td>
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
                            "dd/MM/yyyy hh:MM"
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
                <p className="text-gray-600">Không có giao dịch nào</p>
              </div>
            )}

            {hasViewMore && (
              <div className="w-full flex justify-center mt-2">
                <Button>
                  <Link href={"/history"}>{"Xem toàn bộ"}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {cameraAction.action === "start" && (
        <Dialog
          defaultOpen
          onOpenChange={() => {
            setCameraAction({ ...cameraAction, action: "idle" });
            mutateDeleteTransaction.mutate(toInteger(log[0].id));
            setIsBarcodeFocused((prev) => !prev);
          }}
        >
          <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>
                Đang đóng hàng {cameraAction.trackingCode}{" "}
              </DialogTitle>
              <Timer handleTimeOut={handleRecordComplete} />
              <DialogDescription className="py-4">
                <div>Quá trình đóng hàng đang được thực hiện</div>
                {/* timer */}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex content-between  *:">
              <Button
                ref={finishRecordBtn as React.Ref<HTMLButtonElement>}
                disabled={
                  log.length > 0 &&
                  (log[0].attributes as any).transaction !==
                    cameraAction.trackingCode
                }
                onClick={() => handleRecordComplete()}
              >
                {"Hoàn thành"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Page;
