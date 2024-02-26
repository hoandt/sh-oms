"use client";
import React, { useEffect, useMemo, useState } from "react";
import BarcodeScanForm from "./components/BarcodeScanner";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createLogs, deleteLogs, transformData } from "@/services";
import { ColumnDef } from "@tanstack/react-table";
import { WMSLog } from "@/types/todo";
import { CommonTable } from "@/components/common/table/CommonTable";
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
import { CameraIcon, Loader2Icon, Video } from "lucide-react";
import { DURATION_TOAST } from "@/lib/config";
import { useToast } from "@/components/ui/use-toast";

import SelectCameraDevice from "./components/Webcam";
import CameraRecorder from "./components/VideoRecord";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CurrentUser = () => {
  const { data } = useSession();
  return <div>{data?.user?.email}</div>;
};
type CameraAction = "start" | "stop" | "idle";
export type CameraActionPayload = {
  deviceId: string;
  action: CameraAction;
  trackingCode: string;
};
const Page = () => {
  const [scanActive, setScanActive] = useState<boolean>(false);
  const { toast } = useToast();
  const session = useSession() as any;
  const [user, setUser] = useState<string>("");
  const [log, setLog] = useState<WMSLog[]>([]);
  const [cameraAction, setCameraAction] = useState<CameraActionPayload>({
    deviceId: "",
    action: "idle",
    trackingCode: "",
  });
  useEffect(() => {
    if (session.data) {
      const user = session.data.userWithRole as UserWithRole;
      setUser(user.firstName + " " + user.lastName);
    }
  }, [session]);

  const hasViewMore = log.length > 7;

  const mutateTransaction = useMutation({
    mutationFn: (logs: any) => {
      return createLogs({ logs });
    },
    onSuccess(data, __, _) {
      const newData = (data.data as any).data as WMSLog;
      setLog((prev) => [newData, ...prev].slice(0, 8));
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

      return setLog(newData);
    },
  });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => <div>{row.original.id}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "status",
        header: () => <div className="w-3/4">{"Transaction"}</div>,
        cell: ({ row }) => {
          const transaction = row.original.attributes.transaction;
          return <div className="flex space-x-2">{transaction}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "status",
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
        cell: ({ row }) => (
          <div>
            <CurrentUser />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "videoURL",
        header: () => <div className="">{"Video"}</div>,
        cell: ({ row }) => {
          const videoURL = row.original.attributes.videoUrl;
          return videoURL ? (
            <a
              href={videoURL}
              className="text-blue-500"
              target="_blank"
              rel="noreferrer"
            >
              {videoURL}
            </a>
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "actions",
        header: () => <div className="">{"Hành Động"}</div>,
        cell: ({ row }) => (
          <>
            {/* Display packing url  */}
            <Button variant="outline">
              <CameraIcon className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                className="text-center text-sm leading-6 text-gray-500"
                asChild
              >
                <Button className="flex gap-2" variant="outline">
                  {"Xoá"}
                  {mutateDeleteTransaction.isPending && (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa giao dịch?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?
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
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
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
    setCameraAction({ ...cameraAction, trackingCode: code, action: "start" });
  };

  return (
    <div className="-mt-32 ">
      {/* Add padding-top equivalent to the height of your sticky header */}
      <div className="grid grid-cols-6">
        {/* Sidebar */}
        <div className="bg-slate-200 h-screen col-span-2 pt-32">
          <div className="p-4">
            <SelectCameraDevice
              handleSelect={(device: string) => {
                setCameraAction({ ...cameraAction, deviceId: device });
              }}
            />
            {cameraAction.deviceId && (
              <>
                {" "}
                <div className="rounded shadow my-2">
                  <CameraRecorder
                    action={cameraAction}
                    handleStream={(status: boolean) => {
                      setScanActive(status);
                    }}
                  />
                </div>
              </>
            )}
            {scanActive && (
              <BarcodeScanForm
                handleScan={handleScan}
                isLoading={mutateTransaction.isPending}
              />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-4 pt-32">
          <div className="p-4 ">
            <h1 className="text-2xl text-gray-800">Tracking mã đơn</h1>
            {/* make a button inline */}

            {/* View all transaction button  */}
            <div className="flex justify-between mb-2">
              <h2 className="text-lg text-gray-600">
                {"Nhân viên: "}
                <span className="text-gray-800">{user}</span>
              </h2>
              <Button>
                <Link href={"/history"}>{"Xem toàn bộ"}</Link>
              </Button>
            </div>
            {/* Table */}

            <CommonTable
              filterComponent={null}
              data={log || []}
              columns={columns}
              isLoading={false}
            />

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
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đang đóng hàng</DialogTitle>
              <DialogDescription>
                <h1>{cameraAction.trackingCode}</h1>
                Quá trình đóng hàng đang được thực hiện
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() =>
                  setCameraAction({ ...cameraAction, action: "stop" })
                }
              >
                {"Hoàn thành"}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCameraAction({ ...cameraAction, action: "idle" })
                }
              >
                {"Hủy"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Page;
