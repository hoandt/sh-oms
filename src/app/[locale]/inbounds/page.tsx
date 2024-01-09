"use client";

import { Information } from "./components/Information";
import { CommonTable } from "@/components/common/table/CommonTable";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { DURATION_TOAST } from "@/lib/constants";
import { PAGE_SIZE_TABLE } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useGetInbounds } from "@/query-keys/inbound";
import { updateConfirmInbound, updateStatusInbound } from "@/services/inbounds";
import { OmsInbound, OmsInboundHistory } from "@/types/todo";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ChevronDownIcon,
  ChevronRight,
  ChevronRightIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const optionsTabs = [
  {
    label: "Đơn mới",
    value: "waiting_for_confirm",
  },
  { label: "Đơn hoàn thành", value: "done" },
  { label: "Đơn huỷ", value: "cancelled" },
];

export default function Inbounds() {
  const { toast } = useToast();

  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Secret");

  const searchParams = useSearchParams();
  const status = searchParams.get("status") || optionsTabs[0].value;
  const keyword = searchParams.get("q") || "";

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });

  const {
    data: inbounds,
    isLoading: loadingOutbounds,
    refetch,
  } = useGetInbounds({
    status,
    code: keyword,
    page: pageIndex,
    pageSize,
  });

  const columns = useMemo(() => {
    return [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </button>
          ) : (
            "🔵"
          );
        },
      },
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        enableSorting: false,
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
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="">{"Trạng thái"}</div>,
        cell: ({ row }) => (
          <Badge className="uppercase">{row.getValue("status")}</Badge>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "priority",
        header: () => <div className="">{"Organization"}</div>,
        cell: ({ row }) => {
          const name = row.original?.organization?.data.attributes.name || "";
          return <div className="flex space-x-2">{name}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "priority",
        header: () => <div className="">{"Expected Date"}</div>,
        cell: ({ row }) => {
          const date = row.original.expectedInboundDate || "";
          return (
            <div className="flex space-x-2">
              {format(new Date(date), "dd-mm-yyyy")}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "note",
        header: () => <div className="">{"Ghi chú"}</div>,
        cell: ({ row }) => <div>{row.getValue("note") || "-"}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "action",
        header: () => <div className="">{""}</div>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger
                className="text-center text-sm leading-6 text-gray-500"
                asChild
              >
                <Button type="button" size={"sm"}>
                  Confirm
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
                      mutationConfirm.mutate([row.original]);
                    }}
                  >
                    {mutationConfirm.isPending && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
                <Button type="button" size={"sm"}>
                  <XIcon width={12} height={12} strokeWidth={2} />
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
                      mutationUpdateStatus.mutate(row.original.id);
                    }}
                  >
                    {mutationUpdateStatus.isPending && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<OmsInbound>[];
  }, []);

  const renderSubComponent = ({ row }: { row: Row<OmsInbound> }) => {
    return <Information id={row.original.id} />;
  };

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

  const mutationUpdateStatus = useMutation({
    mutationFn: (id: number) => {
      return updateStatusInbound({ id, status: "cancelled" });
    },
    onSuccess: () => {
      toast({
        duration: DURATION_TOAST,
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
      refetch();
    },
  });

  const mutationConfirm = useMutation({
    mutationFn: (inbound: any) => {
      return updateConfirmInbound({ inbound });
    },
    onSuccess: () => {
      toast({
        duration: DURATION_TOAST,
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
      refetch();
    },
  });

  return (
    <>
      <Tabs
        value={status}
        onValueChange={(value) => {
          onSelect(value);
        }}
        className="w-full"
      >
        <TabsList
          className={cn(
            "w-full grid",
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
              value: "CONFIRM",
            },
          ]}
          onCallbackExtraActionTable={({ type, selected, data }) => {}}
          filterComponent={null}
          data={(inbounds?.data as OmsInbound[]) || []}
          columns={columns}
          isLoading={loadingOutbounds}
          setPagination={setPagination}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={
            Math.ceil((inbounds?.meta?.pagination?.total || 0) / pageSize) || 1
          }
          getRowCanExpand={() => true}
          renderSubComponent={renderSubComponent}
        />
      </Tabs>
    </>
  );
}
