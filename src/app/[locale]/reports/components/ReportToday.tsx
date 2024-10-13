import { Card, CardContent } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/useQueryParams";
import { formatNumberWithCommas } from "@/lib/helpers";
import { useGetReportOrderToday } from "@/query-keys/reports";
import { DollarSign, Package } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

interface ReportCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

interface ToDoItemCardProps {
  value: number;
  label: string;
}

interface Task {
  title: string;
  value: number;
}

const ReportCard: React.FC<ReportCardProps> = ({
  icon: Icon,
  value,
  label,
}) => {
  return (
    <Card className="flex-1">
      <CardContent className="pt-6 flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="mr-2" />
          <span className="text-lg font-bold">{value}</span>
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </CardContent>
    </Card>
  );
};

const ToDoItemCard: React.FC<ToDoItemCardProps> = ({ value, label }) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <span className="text-2xl font-bold">
          {formatNumberWithCommas(value)}
        </span>
        <p className="text-sm text-gray-500">{label}</p>
      </CardContent>
    </Card>
  );
};

const QuickReport: React.FC = () => {
  const { data: session } = useSession() as any;
  const marketplaceIds =
    session?.userWithRole?.organization?.marketplaces?.channelIds.join(",") ||
    "";

  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data } = useGetReportOrderToday({
    marketplaceIds,
    from,
    to,
  });

  return (
    <div className="flex gap-4">
      <ReportCard
        icon={DollarSign}
        value={formatNumberWithCommas(data?.total) || 0}
        label="Tổng giá trị"
      />
      <ReportCard
        icon={Package}
        value={formatNumberWithCommas(data?.quantity) || 0}
        label="Đơn hàng"
      />
    </div>
  );
};

const ToDoList: React.FC = () => {
  const { data: session } = useSession() as any;
  const marketplaceIds =
    session?.userWithRole?.organization?.marketplaces?.channelIds.join(",") ||
    "";

  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data } = useGetReportOrderToday({
    marketplaceIds,
    from,
    to,
  });

  const tasks: Task[] = [
    {
      title: "Chờ đóng gói",
      value: data?.pending || 0,
    },
    { title: "Chờ lấy hàng", value: data?.packed || 0 },
    { title: "Đơn hủy", value: data?.in_cancelled || 0 },
    { title: "Đang vận chuyển", value: data?.shipping || 0 },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Danh sách cần làm</h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {tasks.map((task, index) => (
          <ToDoItemCard key={index} value={task.value} label={task.title} />
        ))}
      </div>
    </div>
  );
};

const ReportToday: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <QuickReport />
        <ToDoList />
      </CardContent>
    </Card>
  );
};

export default ReportToday;
