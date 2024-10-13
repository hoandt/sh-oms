import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumberWithCommas } from "@/lib/helpers";
import { useGetOverviewChannel } from "@/query-keys/reports";
import { IReportOverviewChannelResponse } from "@/types/reports";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Overview() {
  const { data: session } = useSession() as any;
  const marketplaceIds =
    session?.userWithRole?.organization?.marketplaces?.channelIds.join(",") ||
    "";

  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data, isLoading } = useGetOverviewChannel({
    marketplaceIds,
    from,
    to,
  });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "name",
        header: () => <div>{"Tên kênh"}</div>,
        cell: ({ row }) => (
          <div>{row.original.connection_name || row.original.name || "-"}</div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "current_total",
        header: () => <div>{"Tồng số lượng"}</div>,
        cell: ({ row }) => (
          <div>{formatNumberWithCommas(row.original.current_total || 0)}</div>
        ),
        enableSorting: false,
      },

      {
        accessorKey: "change_rate_total",
        header: () => <div>{"Thay đổi"}</div>,
        cell: ({ row }) => {
          const changeRate = row.original.change_rate_total;
          return (
            <div
              style={{
                color: changeRate > 0 ? "green" : "red",
                display: "flex",
                alignItems: "center",
              }}
            >
              {changeRate > 0 ? (
                <div className="flex flex-row items-center gap-1">
                  <TrendingUp size={16} />
                  <span>{`${changeRate}%`}</span>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-1">
                  <TrendingDown size={16} />
                  <span>{`${changeRate}%`}</span>
                </div>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "rate_total",
        header: () => <div>{"Tỷ lệ giá trị"}</div>,
        cell: ({ row }) => <div>{row.original.rate_total}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: () => <div>{"Số lượng"}</div>,
        cell: ({ row }) => (
          <div>{formatNumberWithCommas(row.original.quantity || 0)}</div>
        ),
        enableSorting: false,
      },
    ] as ColumnDef<IReportOverviewChannelResponse>[];
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="space-y-2 p-4">
        <CommonTable
          columns={columns}
          data={data || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
