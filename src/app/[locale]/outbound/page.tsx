"use client";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { PAGE_SIZE_TABLE, formatCurrency } from "@/lib/helpers";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Filter } from "./components/Filter";
import { useGetOutboundsBySapo } from "@/query-keys/outbound";
import { IOutbound } from "@/types/outbound";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const STATUS = {
  finalized: {
    label: "Processing",
    color: "sky",
  },
  completed: {
    label: "Completed",
    color: "green",
  },
  cancelled: {
    label: "Canceled",
    color: "red",
  },
} as {
  [key: string]: {
    label: string;
    color: string;
  };
};

const MARKETPLACE = {
  shopee: {
    label: "Shopee",
    color: "orange",
  },
  tiki: {
    label: "Tiki",
    color: "indigo",
  },
  lazada: {
    label: "Lazada",
    color: "blue",
  },
  tiktok: {
    label: "Tiktok",
    color: "indigo",
  },
  sendo: {
    label: "Sendo",
    color: "yellow",
  },
  other: {
    label: "Retail",
    color: "green",
  },
} as {
  [key: string]: {
    label: string;
    color: string;
  };
};

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession() as any;

  const [tags, setTags] = React.useState<string[]>([]);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE_TABLE,
    });

  const params = useSearchParams();
  const keyword = params.get("q") || "";
  const saleChannel = params.get("saleChannel") || "all";
  const created_on_max = params.get("created_on_max") || "";
  const created_on_min = params.get("created_on_min") || "";

  const { data: outbounds, isLoading } = useGetOutboundsBySapo({
    page: pageIndex + 1,
    pageSize,
    keyword,
    saleChannel,
    created_on_max,
    created_on_min,
  });

  //  useEffect to get the session
  useEffect(() => {
    //check session, if true, get the session
    if (session) {
      // cast the session to UserWithRole, Property 'userWithRole' does not exist on type 'Session'.ts(2339)

      const currentUser = session.userWithRole as any as UserWithRole;
      const tags = currentUser.organization.address;
      //explode tags by comma
      const tagsArray = tags.split(",");
      let uniqueTags = ["all"] as string[];
      const salesTags = tagsArray.map((item, index) => {
        //push the tags to uniqueTags
        let tag = item.split("_")[0].toLowerCase();
        //check if the tag is not in the uniqueTags
        if (!uniqueTags.includes(tag)) {
          uniqueTags.push(tag);
        }
      });

      setTags(uniqueTags);
    }
  }, []);

  const handleSalesChannel = (tag: string) => {
    //check if the tag is all
    if (tag === "all") {
      //redirect to the same page
      router.push("/outbound");
    } else {
      //redirect to the same page with the tag
      router.push(`/outbound?saleChannel=${tag}`);
    }
  };

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "channel",
        header: () => <div className="">{"Sales Channel"}</div>,
        cell: ({ row }) => {
          const channel = row.original.channel;
          const marketplace = channel
            ? channel.replace("Sàn TMĐT - ", "").toLowerCase()
            : "other";

          if (MARKETPLACE[marketplace]) {
            return (
              <div className="flex space-x-2">
                {/* make a bullet with color for each marketplace */}
                <span
                  className={`inline-block w-4 bg-${MARKETPLACE[marketplace].color}-500  px-3 rounded`}
                ></span>
                <span className={` `}>{MARKETPLACE[marketplace].label}</span>
              </div>
            );
          }
        },
      },
      {
        accessorKey: "id",
        width: 60,
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => {
          const code = row.original.code || "-";
          return <div className="flex space-x-2">{code}</div>;
        },
      },
      {
        accessorKey: "item",
        header: () => <div className="">{"Created On"}</div>,
        cell: ({ row }) => {
          const createdOn = row.original.created_on || "-";
          return (
            <div className="flex space-x-2">
              {format(createdOn, "dd/MM/yyyy HH:mm")}
            </div>
          );
        },
      },
      {
        accessorKey: "sku",
        header: () => <div className="">{"Customer"}</div>,
        cell: ({ row }) => {
          const name = row.original.customer_data.name || "-";
          return <div>{name}</div>;
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="">{"Status"}</div>,
        cell: ({ row }) => {
          const status = row.original.status || "";
          const label = STATUS[status] && STATUS[status].label;
          const color = STATUS[status] ? STATUS[status].color : "gray";
          return (
            <div>
              <span
                className="bg-green-50
              bg-indigo-500
               text-green-600  bg-blue-50 bg-red-50 bg-blue-50 bg-orange-500 bg-sky-500 bg-blue-50 text-sky-600 bg-green-500"
              ></span>

              <span className={`bg-${color}-50 text-${color}-600 px-2 rounded`}>
                {label}
              </span>
            </div>
          );
        },
      },

      {
        accessorKey: "available",
        header: () => <div className="">{"Total"}</div>,
        cell: ({ row }) => {
          const total = row.original.total;
          return <div>{formatCurrency(total)}</div>;
        },
      },
    ] as ColumnDef<IOutbound>[];
  }, []);

  return (
    <div className="p-4">
      {/* display all tags*/}
      {outbounds && outbounds?.data?.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-1 px-2">
            {
              /* tags */
              tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => {
                    handleSalesChannel(tag);
                  }}
                  className={cn({
                    "cursor-pointer px-2 py-1 rounded rounded-b-none capitalize min-w-32 text-center":
                      true,
                    "bg-slate-200 text-gray-700 ": saleChannel !== tag,
                    "bg-slate-800 text-orange-50 font-bold":
                      saleChannel === tag,
                  })}

                  // saleChannel
                >
                  {tag}
                </span>
              ))
            }
          </div>
        </div>
      )}
      <Card>
        <CardContent>
          <CommonTable
            extraActionTable={[]}
            filterComponent={<Filter />}
            onClickRow={(e) => {
              router.push(`/outbound/detail/${e.original.id}`);
            }}
            data={(outbounds?.data as any[]) || []}
            columns={columns}
            isLoading={isLoading}
            setPagination={setPagination}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={Math.ceil((outbounds?.meta?.total || 0) / pageSize) || 1}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
