"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetReportPriceOrdersChannel } from "@/query-keys/reports";
import { PlatformCard } from "./PlatformCard";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  shopee: {
    label: "Shopee",
    color: "hsl(var(--chart-1))",
  },
  tiktokshop: {
    label: "Tiktokshop",
    color: "hsl(var(--chart-2))",
  },
  lazada: {
    label: "Lazada",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

enum TAB {
  VALUE = "Value",
  ORDER = "Order",
}

export function PriceOrderByChannel() {
  const { data: session } = useSession() as any;
  const marketplaceIds =
    session?.userWithRole?.organization?.marketplaces?.channelIds.join(",") ||
    "";

  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data } = useGetReportPriceOrdersChannel({
    marketplaceIds,
    from,
    to,
  });

  const chartDataTotal = [
    {
      browser: "shopee",
      visitors: data?.[0]?.total || 0,
      fill: "var(--color-shopee)",
    },
    {
      browser: "lazada",
      visitors: data?.[1]?.total || 0,
      fill: "var(--color-lazada)",
    },
    {
      browser: "tiktokshop",
      visitors: data?.[2]?.total || 0,
      fill: "var(--color-tiktokshop)",
    },
  ];

  const chartDataQuantity = [
    {
      browser: "shopee",
      visitors: data?.[0]?.quantity || 0,
      fill: "var(--color-shopee)",
    },
    {
      browser: "lazada",
      visitors: data?.[1]?.quantity || 0,
      fill: "var(--color-lazada)",
    },
    {
      browser: "tiktokshop",
      visitors: data?.[2]?.quantity || 0,
      fill: "var(--color-tiktokshop)",
    },
  ];

  return (
    <Card className="min-w-[500px] space-y-5">
      <CardHeader className="items-center pb-0">
        <CardTitle>{"Giá trị đơn hàng theo sàn"}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0 w-full">
        <Tabs
          defaultValue={TAB.VALUE}
          className="w-full rounded flex flex-col gap-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value={TAB.VALUE}
              className="py-2 text-center data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-500"
            >
              Tổng giá trị
            </TabsTrigger>
            <TabsTrigger
              value={TAB.ORDER}
              className="py-2 text-center data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-500"
            >
              Đơn hàng
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TAB.VALUE}>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartDataTotal}
                  dataKey="visitors"
                  label
                  nameKey="browser"
                />
              </PieChart>
            </ChartContainer>

            <div className="flex flex-row gap-3 p-3 flex-wrap">
              {data?.map((e, index) => {
                return (
                  <PlatformCard
                    key={index}
                    platform={e.channel_name}
                    value={e.total.toString()}
                    color="black"
                    bgColor="bg-blue-100"
                  />
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value={TAB.ORDER}>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartDataQuantity}
                  dataKey="visitors"
                  label
                  nameKey="browser"
                />
              </PieChart>
            </ChartContainer>

            <div className="flex flex-row gap-3 p-3 flex-wrap">
              {data?.map((e, index) => {
                return (
                  <PlatformCard
                    key={index}
                    platform={e.channel_name}
                    value={e.quantity.toString()}
                    color="black"
                    bgColor="bg-blue-100"
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
