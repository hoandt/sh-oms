"use client";
import React, { useMemo } from "react";
import { useGetLogs } from "@/query-keys/logs/query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { SystemInventory, WMSLog } from "@/types/todo";
import { CommonTable } from "@/components/common/table/CommonTable";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { deleteLogs } from "@/services";
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
import { Loader2Icon, PlayCircle, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DURATION_TOAST } from "@/lib/config";
import { toInteger } from "lodash";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import VideoPlayer from "./component/VideoPlayer";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

const page = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const session = useSession() as any;
  const user = session.data as any;
  const [isOpen, setIsOpen] = React.useState(false);
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });
  if (!user) return <div>loading...</div>;

  const {
    data: logs,
    isLoading,
    refetch,
  } = useGetLogs({
    organization: user.userWithRole.organization.id,
    page: pageIndex,
    pageSize,
    code: keyword,
  });
  const handleVideoUrl = async (log: WMSLog) => {
    // check url is valid and contain cloudinary
    if (log.attributes.videoUrl.includes("cloudinary")) {
      // encode url for get params

      const cloudinaryUrl = await fetch("/api/controller/download", {
        method: "POST",
        body: JSON.stringify(log),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await cloudinaryUrl.json();
      // console.log({ data });
      setCurrentVideo(data);
    } else {
      setCurrentVideo(log.attributes.videoUrl);
    }
  };
  const mutateDeleteTransaction = useMutation({
    mutationFn: (id: number) => {
      return deleteLogs({ id });
    },
    onSuccess: (data: any) => {
      toast({
        duration: DURATION_TOAST,
        title: "Đã xóa",
        description: `Giao dịch ${JSON.stringify(
          data.data.data.attributes.transaction
        )} đã được xóa!`,
      });
      refetch();
    },
  });
  const [currentVideo, setCurrentVideo] = React.useState<string>("");
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
        header: () => <div className="">{"Bàn đóng"}</div>,
        cell: ({ row }) => {
          const user = row.original.attributes.user;
          return <div>{user}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "videoURL",
        header: () => <div className="">{"Video"}</div>,
        cell: ({ row }) => {
          const videoURL = row.original.attributes.videoUrl;
          return videoURL ? (
            //  display Camera icon

            <PlayCircle
              onClick={() => {
                setIsOpen(true);
                handleVideoUrl(row.original);
              }}
              className="h-6 w-6 text-slate-500 cursor-pointer"
            />
          ) : (
            "-"
          );
        },
      },
      // type
      {
        accessorKey: "type",
        header: () => <div className="">{"Type"}</div>,
        cell: ({ row }) => {
          const type = row.original.attributes.type;
          return <div>{type}</div>;
        },
        enableSorting: true,
        enableHiding: false,
      },
      // {
      //   accessorKey: "actions",
      //   header: () => <div className="">{"Hành Động"}</div>,
      //   cell: ({ row }) => (
      //     <AlertDialog>
      //       <AlertDialogTrigger
      //         className="text-center text-sm leading-6 text-gray-500"
      //         asChild
      //       >
      //         <Button className="flex gap-2" variant={"link"}>
      //           <Trash className="h-4 w-4 text-red-500" />
      //           {mutateDeleteTransaction.isPending && (
      //             <Loader2Icon className="h-4 w-4 animate-pulse" />
      //           )}
      //         </Button>
      //       </AlertDialogTrigger>
      //       <AlertDialogContent>
      //         <AlertDialogHeader>
      //           <AlertDialogTitle>Xóa giao dịch?</AlertDialogTitle>
      //           <AlertDialogDescription>
      //             Hành động này không thể hoàn tác, bạn phải thực hiện đóng gói
      //             lại.
      //           </AlertDialogDescription>
      //         </AlertDialogHeader>
      //         <AlertDialogFooter>
      //           <AlertDialogCancel>Cancel</AlertDialogCancel>
      //           <AlertDialogAction
      //             className="bg-red-500 text-red-50"
      //             onClick={() => {
      //               mutateDeleteTransaction.mutate(toInteger(row.original.id));
      //             }}
      //           >
      //             {mutateDeleteTransaction.isPending && (
      //               <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
      //             )}
      //             Xác nhận
      //           </AlertDialogAction>
      //         </AlertDialogFooter>
      //       </AlertDialogContent>
      //     </AlertDialog>
      //   ),
      //   enableSorting: false,
      //   enableHiding: false,
      // },
    ] as ColumnDef<WMSLog>[];
  }, []);

  return (
    <div className="px-4">
      {currentVideo && (
        <Dialog
          defaultOpen={isOpen}
          onOpenChange={() => {
            setIsOpen((prev) => !prev);
            setCurrentVideo("");
          }}
        >
          <DialogHeader>Video</DialogHeader>
          <DialogContent className="w-[480px]">
            <VideoPlayer src={currentVideo} />
          </DialogContent>
        </Dialog>
      )}
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
    </div>
  );
};

export default page;
