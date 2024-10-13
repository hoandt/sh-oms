"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetPriceOrder } from "@/query-keys/reports";
import { StatCard } from "./StatCard";
import { useSession } from "next-auth/react";
import { formatNumberWithCommas } from "@/lib/helpers";
import { useSearchParams } from "next/navigation";
import { parse } from "date-fns";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type DataItem = {
  time: string;
  total: number;
  quantity: number;
  average: number;
};

function sortByTime(data: DataItem[]): DataItem[] {
  return data?.sort((a, b) => {
    const dateA = parse(a.time, "dd/MM/yyyy", new Date());
    const dateB = parse(b.time, "dd/MM/yyyy", new Date());
    return dateA.getTime() - dateB.getTime(); // Ascending order
  });
}

export function PriceOrderChart() {
  const { data: session } = useSession() as any;
  const marketplaceIds =
    session?.userWithRole?.organization?.marketplaces?.channelIds.join(",") ||
    "";

  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data } = useGetPriceOrder({
    marketplaceIds,
    from,
    to,
  });

  const chartData =
    sortByTime(data?.revenues)?.map((e) => {
      return {
        month: e.time,
        desktop: e.quantity,
        mobile: e.total,
        tablet: e.average,
      };
    }) || [];

  const totalValue =
    formatNumberWithCommas(data?.comparison?.current_revenue) || 0;
  const totalOrder =
    formatNumberWithCommas(data?.comparison?.current_order_count) || 0;
  const totalAverage =
    formatNumberWithCommas(data?.comparison?.current_average_revenue) || 0;

  const totalValueRatio = data?.comparison?.change_rate_revenue || 0;
  const totalOrderRatio = data?.comparison?.change_rate_order_count || 0;
  const totalAverageRatio = data?.comparison?.change_rate_average_revenue || 0;

  return (
    <Card className="min-w-[860px]">
      <CardHeader>
        <CardTitle>{"Giá trị đơn hàng"}</CardTitle>
      </CardHeader>

      <div className="flex flex-row gap-2 p-3">
        <StatCard
          title="Tổng giá trị"
          value={String(totalValue)}
          percentageChange={totalValueRatio}
          change={""}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={`${String(totalOrder)} đơn`}
          percentageChange={totalOrderRatio}
          change={""}
        />
        <StatCard
          title="Tổng giá trị / đơn"
          value={String(totalAverage)}
          percentageChange={totalAverageRatio}
          change={""}
        />
      </div>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="tablet"
              type="monotone"
              stroke="var(--color-tablet)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
