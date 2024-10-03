"use client";
import React, { useEffect, useMemo } from "react";
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
  CopyIcon,
  DownloadCloud,
  DownloadCloudIcon,
  Loader2Icon,
  PlayCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DURATION_TOAST } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import VideoPlayer from "./component/VideoPlayer";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Filter } from "./component/Filter";

const page = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
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
    page: pageIndex + 1,
    pageSize,
    code: keyword,
    status,
  });

  const [isLoadingURL, setIsLoading] = React.useState(false);
  //use effect esc set is loading to false
  useEffect(() => {
    //detect ESC key
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLoading(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
  const handleDownload = async (
    log: WMSLog,
    type: "download" | "preview" = "download"
  ) => {
    //type preview
    if (type === "preview") {
      setIsLoading(true);
      try {
        log.attributes.action = "preview";
        const cloudinaryUrl = await fetch("/api/controller/download", {
          method: "POST",
          body: JSON.stringify(log),
          headers: {
            "Content-Type": "application/json",
          },
        });

        //sleep for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 35000));
        const updatedLogs = refetch();

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("error", error);
      }
    }

    //type download

    // check log history
    let videoUrl = "";
    if (
      log.attributes.history &&
      log.attributes.history.find((v) => v.status === "success")
    ) {
      videoUrl =
        log.attributes.history.find((v) => v.status === "success")?.message ||
        "";
      const a = document.createElement("a");
      a.href = videoUrl;
      a.target = "_blank";
      a.download = `video-${log.attributes.transaction}.mp4`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      setIsLoading(true);
      try {
        log.attributes.action = "download";
        const cloudinaryUrl = await fetch("/api/controller/download", {
          method: "POST",
          body: JSON.stringify(log),
          headers: {
            "Content-Type": "application/json",
          },
        });
        //sleep for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const updateLogs = refetch();
        console.log((await updateLogs).data);

        setIsLoading(false);
        toast({
          duration: DURATION_TOAST,
          title: "Video đang được xử lý",

          description: `Video của giao dịch ${log.attributes.transaction} đang được xử lý, vui lòng chờ trong giây lát!`,
        });
      } catch (error) {
        setIsLoading(false);
        console.log("error", error);
      }
    }
  };

  const handleVideoUrl = async (log: WMSLog) => {
    //check log history for success
    if (
      log.attributes.history &&
      log.attributes.history.find((v) => v.status === "success")
    ) {
      console.log(
        log.attributes.history.find((v) => v.status === "success")?.message ||
          ""
      );
      setCurrentVideo(
        log.attributes.history.find((v) => v.status === "success")?.message ||
          ""
      );
      return;
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
        accessorKey: "user",
        header: () => <div className="">{"Packer ID"}</div>,
        cell: ({ row }) => {
          const user = row.original.attributes.user;
          return <div>{user}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "transaction",
        header: () => <div className="">{"Transaction"}</div>,
        cell: ({ row }) => {
          const transaction = row.original.attributes.transaction;
          return <div className="flex space-x-2">{transaction}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "note",
        header: () => <div className="">{"Date"}</div>,
        cell: ({ row }) => {
          const date = row.original.attributes.createdAt;
          return <div>{format(date, "HH:mm dd/MM/yyyy")}</div>;
        },
        enableSorting: false,
        enableHiding: false,
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
      {
        accessorKey: "videoURL",
        header: () => <div className="">{"Preview"}</div>,
        cell: ({ row }) => {
          const videoUrl = row.original.attributes.history?.find(
            (v) => v.status === "success"
          )?.message;

          return videoUrl ? (
            //  display Camera icon

            <PlayCircle
              onClick={() => {
                setIsOpen(true);
                handleVideoUrl(row.original);
              }}
              className="h-6 w-6 text-slate-600 cursor-pointer"
            />
          ) : (
            <PlayCircle
              onClick={() => {
                handleDownload(row.original, "preview");
              }}
              className="h-6 w-6 text-orange-600 cursor-pointer"
            />
          );
        },
      },
      {
        accessorKey: "actions",
        header: () => <div className="">{"Download"}</div>,
        cell: ({ row }) => {
          const videoURL = row.original.attributes.history?.find(
            (v) => v.status === "success"
          );
          return videoURL ? (
            //  display Download icon
            <div className="flex">
              <Button
                disabled={isLoadingURL}
                className="px-4 bg-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-md"
                variant={"outline"}
                onClick={() => {
                  handleDownload(row.original);
                }}
              >
                <DownloadCloud className="h-6 w-6 cursor-pointer mr-2" />
                {isLoadingURL ? "Processing..." : "Download"}
              </Button>
              {videoURL && (
                <Button
                  variant={"link"}
                  size={"sm"}
                  className="text-blue-500"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      getVerifyLink(`${row.original.id}`)
                    );
                    toast({
                      duration: DURATION_TOAST,
                      title: "Copied",
                      variant: "default",
                      description: `Video link of transaction ${row.original.attributes.transaction} has been copied!`,
                    });
                  }}
                >
                  <CopyIcon className="h-4 w-4 cursor-pointer mr-2 text-blue-400" />{" "}
                  Verification Link
                </Button>
              )}
            </div>
          ) : (
            "-"
          );
        },
        enableSorting: false,
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
          <DialogHeader></DialogHeader>
          <DialogContent className="w-[480px]">
            <VideoPlayer src={currentVideo} />
            {/* open video in a new tab */}
          </DialogContent>
        </Dialog>
      )}
      {isLoadingURL && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center  text-white gap-2">
          <Loader2Icon className="h-8 w-8 animate-spin" />
          <p>Đang xử lý, xin đợi trong 30s - 60s...</p>
          {/* output video url */}
        </div>
      )}

      <CommonTable
        extraActionTable={[]}
        filterComponent={<Filter />}
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

const getVerifyLink = (id: string) => {
  const shiftedId = shiftId(id, 2);
  const link = `https://swifthub.net/tracking/?id=${shiftedId}`;
  return link;
};

function shiftId(id: string, offset: number) {
  const alphabet = "a9B1c2D8e3F7g4H6j5KmNpQrSTUvWxYz";
  const idString = id.toString();
  let shiftedId = "";

  for (let i = 0; i < idString.length; i++) {
    let digit = parseInt(idString[i]) + offset;
    // Ensure the digit wraps around if it goes beyond 9
    const adjustedDigit = digit % 10;
    digit = adjustedDigit < 0 ? adjustedDigit + 10 : adjustedDigit;
    shiftedId += alphabet[digit];
  }

  return shiftedId;
}
