"use client";

import { useTranslations } from "next-intl";
import React, {  useMemo} from "react";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, Loader2Icon, Trash, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { useGetOutbound, useGetOutbounds } from "@/query-keys";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteOutbound, updateFlowOutbound } from "@/services/outbounds";
import { OmsOutbound } from "@/types/todo";
import { CommonTable } from "@/components/common/table/CommonTable";
import { cn } from "@/lib/utils";
import { Information } from "./components/Information";
import {AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { DURATION_TOAST } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const optionsTabs = [
  {
    label: "Đơn mới",
    value: "new,pending"
  },
  { label: "Đơn đang xử lý", value: "processing,picking,picked" },
  { label: "Đơn hoàn thành", value: "ready_to_ship" },
  { label: "Đơn huỷ", value: "cancelled" }
];

export default function Inbounds() {
  const t = useTranslations("Secret");
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const status = searchParams.get("status") || optionsTabs[0].value;
  const keyword = searchParams.get("q") || "";

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE
    });

  const {
    data: outbounds,
    isLoading: loadingOutbounds,
    refetch
  } = useGetOutbounds({
    status,
    code: keyword,
    page: pageIndex,
    pageSize
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => {
      return deleteOutbound({ id });
    },
    onSuccess: () => {
      toast({
        duration: DURATION_TOAST,
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
      refetch();
    }
  });

  const mutationConfirm = useMutation({
    mutationFn: (outbounds: any) => {
      return updateFlowOutbound({ outbounds });
    },
    onSuccess: () => {
      toast({
        duration: DURATION_TOAST,
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
      refetch();
    }
  });

  function navigatePageDetail(id: string) {
    router.push(`/wmt/outbounds/${id}`);
  }

  const columns = useMemo(() => {
    return [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
               {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </button>
          ) : (
            '🔵'
          )
        },
      },
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => (
          <div onClick={() => navigatePageDetail(row.getValue("code"))}>
            {row.getValue("id")}
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "code",
        header: () => <div>{"Mã"}</div>,
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span>{row.getValue("code")}</span>
            </div>
          );
        }
      },
      {
        accessorKey: "status",
        header: () => <div className="">{"Trạng thái"}</div>,
        cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "priority",
        header: () => <div className="">{"Độ ưu tiên"}</div>,
        cell: ({ row }) => <div>{row.getValue("priority")}</div>,
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "codAmount",
        header: () => <div className="">{"Doanh thu"}</div>,
        cell: ({ row }) => <div>{row.getValue("codAmount")}</div>,
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Ghi chú"}</div>,
        cell: ({ row }) => <div>{row.getValue("note") || "-"}</div>,
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "action",
        header: () => <div className="">{""}</div>,
        cell: ({ row }) => (
          <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger
                    className="text-center text-sm leading-6 text-gray-500"
                    asChild
            >
                    <Button
                          type="button"
                          size={"sm"}
                        >
                          <CheckIcon width={16} />
                    </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=> {
                          mutationConfirm.mutateAsync([row.original]);
                    }}>
                      {mutationConfirm.isPending &&  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> }
                      Confirm
                    </AlertDialogAction>
                </AlertDialogFooter> 
              </AlertDialogContent>      
          </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger
                        className="text-center text-sm leading-6 text-gray-500"
                        asChild
                >
                        <Button
                              type="button"
                              size={"sm"}
                            >
                              <Trash width={16} />
                        </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=> {
                              mutationDelete.mutateAsync(row.original.id);
                        }}>
                          {mutationDelete.isPending &&  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                          Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter> 
                  </AlertDialogContent>      
              </AlertDialog>
          </div>
       
        ),
        enableSorting: false,
        enableHiding: false
      }
    ] as ColumnDef<OmsOutbound>[];
  }, []);


  const renderSubComponent = ({ row }: { row: Row<OmsOutbound> }) => {
    return (
        <Information id={row.original.id} />
    )
  }

 
  const selectedValues = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  const onSelect = (option: string) => {
    if (!option) {
      selectedValues.delete("status");
    } else {
      selectedValues.set("status", option);
    }
    const search = selectedValues.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <Tabs
        value={status || optionsTabs[0].value}
        onValueChange={(value) => {
          onSelect(value);
        }}
        className="w-full"
      >
        <TabsList
          className={cn(
            "w-full flex",
            optionsTabs.length && `grid-cols-${optionsTabs.length}`
          )}
        >
          {optionsTabs.map((option, index) => {
            return (
              <TabsTrigger className="w-full" key={index} value={option.value}>
                {option.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <CommonTable
          extraActionTable={[
            {
              label: "Confirm Outbound",
              value: "CONFIRM"
            }
          ]}
          onCallbackExtraActionTable={({ type, selected, data }) => {}}
          filterComponent={null}
          data={(outbounds?.data as OmsOutbound[]) || []}
          columns={columns}
          isLoading={loadingOutbounds}
          setPagination={setPagination}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={Math.ceil(
            (outbounds?.meta?.pagination?.total || 0) / pageSize
          ) || 1}
          getRowCanExpand={() => true}
          renderSubComponent={renderSubComponent}  
        />
      </Tabs>
  );
}
