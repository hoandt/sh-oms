import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumberWithCommas } from "@/lib/helpers";
import { useGetBestSeller } from "@/query-keys/reports";
import { IReportBestSeller, IReportBestSellerResponse } from "@/types/reports";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function BestSeller() {
  const { data: session } = useSession() as any;
  const marketplaceIds =
    session?.userWithRole?.organization?.marketplaces?.channelIds.join(",") ||
    "";

  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data, isLoading } = useGetBestSeller({
    marketplaceIds,
    from,
    to,
  });

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "id",
        header: () => <div>{"ID"}</div>,
        cell: ({ row }) => (
          <div className="font-bold">{`# ${row.index + 1}`}</div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "variation_name",
        header: () => <div>{"Tên sản phẩm"}</div>,
        cell: ({ row }) => <div>{row.original.variation_name}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "revenue",
        header: () => <div className="">{"Doanh thu"}</div>,
        cell: ({ row }) => {
          const revenue = formatNumberWithCommas(row.original.revenue) || 0;
          return <div className="w-[200px]">{`${revenue} đ`}</div>;
        },
        enableSorting: false,
      },
    ] as ColumnDef<IReportBestSellerResponse>[];
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="space-y-2 p-4">
        <CommonTable
          columns={columns}
          data={data?.products || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
