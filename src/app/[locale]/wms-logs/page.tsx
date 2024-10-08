"use client";
import React, { useEffect, useRef, useState } from "react";
import BarcodeScanForm from "./components/BarcodeScanner";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createLogs, deleteLogs, getLogs, updateLogs } from "@/services";
import { SHOrder, WMSLog } from "@/types/todo";
import { format } from "date-fns";
import Link from "next/link";
import { signOut } from "next-auth/react";

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

import SelectCameraDevice from "./components/Webcam";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toInteger } from "lodash";
import { cn } from "@/lib/utils";

import { VideoUploadResponse } from "@api.video/video-uploader";
import CanvasVideoRecorder from "./components/CanvaVideoRecorder";
import Timer from "./components/Timer";
import { getSHOrders } from "@/services/sh-orders";
import ScanLineItems from "./components/ScanLineItems";
import TransactionTable from "./components/TransactionTable";
import PickingBarcodeScanner from "../picking/components/PickingBarcodeScanner";
import PackingInstruction from "./components/PackingInstruction";

type CameraAction = "start" | "stop" | "idle";
export type CameraActionPayload = {
  deviceId: string;
  action: CameraAction;
  trackingCode: string;
  log: VideosLog[];
  isSaveToLocal: boolean;
};
const Page = () => {
  const [scanActive, setScanActive] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>("");
  const [isBarcodeFocused, setIsBarcodeFocused] = useState<boolean>(false);
  const { toast } = useToast();
  const [SHOrder, setSHOrder] = useState<SHOrder>();
  const [transactions, setTransactions] = useState<WMSLog[]>([]);
  const finishRecordBtn = useRef<HTMLButtonElement | undefined>();
  const [video, setVideo] = useState<VideoUploadResponse>();
  const session = useSession() as any;
  const [currentUser, setCurrentUser] = useState<UserWithRole>();
  const [log, setLog] = useState<VideosLog[]>([]);
  const [cameraAction, setCameraAction] = useState<CameraActionPayload>({
    deviceId: "",
    action: "idle",
    trackingCode: "",
    log,
    isSaveToLocal: true,
  });
  const mutateUpdateLog = useMutation({
    mutationFn: ({
      id,
      videoUrl,
      status,
    }: {
      id: number;
      videoUrl: string;
      status: string;
    }) => {
      return updateLogs({ id, videoUrl, status });
    },
    onSuccess: (data: any) => {
      // Handle success if needed
    },
  });

  useEffect(() => {
    if (video && video.assets?.mp4) {
      // find the log with the same tracking code and update the video url
      const uploadedLog = log.find(
        (l) => (l.attributes as any).transaction === video.videoId
      );
      mutateUpdateLog.mutate({
        id: toInteger(uploadedLog?.id),
        videoUrl: video.assets?.mp4 || "",
        status: video.description || "packed",
      });
    }
    // warning user alert if the video is not uploaded and user try to close the tab or navigate away
    if (video && !video.assets?.mp4) {
      window.onbeforeunload = function () {
        return "Bạn có chắc chắn muốn rời khỏi trang này?";
      };
    }
  }, [video]);

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
    setIsBarcodeFocused(true);
  }, [cameraAction]);

  const mutateTransaction = useMutation({
    mutationFn: (logs: any) => {
      return createLogs({ logs });
    },
    onSuccess(data, __, _) {
      const newData = (data.data as any).data as VideosLog;
      setCameraAction({
        ...cameraAction,
        log: [newData, ...log],
      });
      setLog((prev) => [newData, ...prev]);
    },
    onError(error) {
      //alert
      toast({
        duration: DURATION_TOAST,
        title: "Lỗi",
        description: "Không thể thêm giao dịch",
        variant: "destructive",
      });
      signOut();
    },
  });

  const handleUploadingProgress = (
    uploading: boolean,
    trackingCode: string,
    video?: VideoUploadResponse
  ) => {
    video && setVideo(video);
    setLog((prev) =>
      // filter out log with video url
      prev
        .filter((l) => !l.videoUrl)
        .map((l) => {
          if ((l.attributes as any).transaction === trackingCode) {
            return {
              ...l,
              isUploading: uploading,
              videoUrl: video?.assets?.mp4,
              status: video?.description,
            };
          }
          return l;
        })
    );
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
    setTransactions([]);
  };

  const handleScan = (code: string) => {
    mutateTransaction.mutate({
      organization: currentUser?.organization.id,
      transaction: code,
      type: "packing",
      status: "packing",
      user: `${currentUser?.id}`,
    });
    setSHOrder(undefined);
    setBarcode(code);
    getSHOrders({ trackingNumber: code }).then((data) => {
      //set line items if order is found
      if (data.data.length) {
        setSHOrder(data.data[0]);
      }
    });
    getLogs({
      organization: currentUser!.organization.id.toString(),
      code: code,
    }).then((data) => {
      if (data.data.length) {
        setTransactions(data.data);
      }
    });
    setCameraAction({ ...cameraAction, trackingCode: code, action: "start" });
  };
  return (
    <div className="-mt-32 ">
      {/*  */}

      {/* Add padding-top equivalent to the height of your sticky header */}
      <div className="grid grid-cols-6">
        {/* Sidebar */}
        <div className="bg-slate-200 h-screen col-span-6 sm:col-span-2 pt-32">
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
                  {currentUser && (
                    <CanvasVideoRecorder
                      action={cameraAction}
                      handleStream={(status: boolean) => {
                        setScanActive(status);
                      }}
                      currentUser={currentUser}
                      handleUploadingProgress={(
                        isUploading: boolean,
                        trackingCode: string,
                        video?: VideoUploadResponse
                      ) =>
                        handleUploadingProgress(
                          isUploading,
                          trackingCode,
                          video
                        )
                      }
                    />
                  )}
                </div>
              </>
            )}
            <SelectCameraDevice
              handleSelect={(device: string) => {
                setCameraAction({ ...cameraAction, deviceId: device });
              }}
            />
            {!SHOrder && transactions.length === 0 && (
              // display instruction, image logo
              <div className="flex flex-col items-center justify-center bg-black px-4 py-2">
                <div className="text-white text-sm text-center font-bold py-1">
                  {/* image with border  */}
                  <div className="px-2 rounded text-center  pb-2">
                    <a href="https://www.tiktok.com/@swifthub.net">
                      <img
                        src="https://swifthub.net/wp-content/uploads/2024/09/Screenshot-2024-09-10-at-02.23.56.png"
                        alt="scan barcode"
                        className="text-center w-32 mx-auto "
                      />
                    </a>
                    Sắp ra mắt:{" "}
                    <a href="https://www.tiktok.com/@swifthub.net">
                      Xác nhận hàng hóa và số lượng với barcode (Click tư vấn)
                    </a>
                    <img
                      src="https://swifthub.net/wp-content/uploads/2024/09/noi-dung.jpg"
                      alt="scan barcode"
                      className="rounded-lg   mx-auto "
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}

        <div className="col-span-6 sm:col-span-4 pt-32">
          <div className="p-4 ">
            <h1 className="text-2xl text-slate-600 flex font-bold ">
              Đóng hàng
            </h1>

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
            {log.filter((l) => l.isUploading).length ? (
              <p
                // status section
                className="text-slate-500  text-sm "
              >
                Đang xử lý tải lên server:{" "}
                <span className="  p-1  w-2 rounded bg-green-100 text-green-600 ">
                  {" "}
                  {log.filter((l) => l.isUploading).length}
                </span>
              </p>
            ) : (
              ""
            )}
            {/* Display a simple table show recent log, if log is empty, display placeholder message */}
            {log.length > 0 ? (
              <table className="w-full bg-white rounded border px-2">
                <thead>
                  <tr className="px-2 py-4 text-sm">
                    <th className="text-left px-2 py-3">STT</th>
                    <th className="text-left px-2 py-3">Mã đơn</th>
                    <th className="text-left px-2 py-3">Nhân viên</th>
                    <th className="text-left px-2 py-3">Thời gian</th>
                    <th className="text-left px-2 py-3">Status</th>
                    <th className="text-left px-2 py-3">Hành động</th>
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
                          {format(new Date(), "dd/MM/yyyy")}
                        </td>
                        <td className="px-3 py-2">
                          {l.videoUrl ? (
                            // view video with link
                            <a target="_blank">Đã upload</a>
                          ) : l.isUploading ? (
                            <div className="flex items-center gap-2">
                              <span className="text-orange-500  animate-pulse">
                                đang tải lên
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400  ">
                              uploading...
                            </span>
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
            {log.length > 5 && (
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
      </div>

      {cameraAction.action === "start" && (
        <Dialog
          defaultOpen
          onOpenChange={() => {
            setCameraAction({ ...cameraAction, action: "idle" });
            log.length && mutateDeleteTransaction.mutate(toInteger(log[0].id));
            setIsBarcodeFocused((prev) => !prev);
            setTransactions([]);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            hideCloseButton
            className="min-w-[720px] h-full p-2 "
          >
            <DialogHeader className="m-0 p-0">
              {currentUser && (
                <Timer
                  handleTimeOut={() => handleRecordComplete()}
                  isTrial={currentUser?.isTrial}
                />
              )}
              <DialogDescription className="py-4 px-1 max-h-[500px] overflow-scroll ">
                <div>Quá trình đóng hàng đang được thực hiện</div>
                {/* display line items */}
                <div className="flex">
                  {SHOrder && currentUser && (
                    <ScanLineItems
                      shOrder={SHOrder}
                      organization={currentUser.organization.id}
                      handleComplete={handleRecordComplete}
                    />
                  )}

                  {!SHOrder && transactions.length > 0 && (
                    <TransactionTable transactions={transactions} />
                  )}
                </div>
                {barcode && <PackingInstruction barcode={barcode} />}

                {/* timer */}
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="w-full flex justify-between">
                {!SHOrder && (
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
                )}
                <DialogClose tabIndex={-1}>
                  <div className="bg-slate-50 border rounded shadow px-4 py-3 text-sm text-red-500 cursor-pointer inline-flex justify-center items-center">
                    Cancel
                  </div>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Page;
// create type extends WMSLog to keep track uploaded video progress
type VideosLog = WMSLog & {
  videoUrl?: string;
  isUploading?: boolean;
};
