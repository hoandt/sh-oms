import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react"; // Using Lucide icons

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  percentageChange: number; // e.g., 211%
}

export function StatCard({
  title,
  value,
  change,
  percentageChange,
}: StatCardProps) {
  const isPositive = percentageChange >= 0;

  return (
    <Card className="shadow-lg border rounded-lg w-full ">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-600 text-sm">{title}</CardTitle>
        <span className="text-blue-500">
          <i className="fas fa-info-circle"></i> {/* Info icon */}
        </span>
      </CardHeader>
      <CardContent className=" flex justify-between items-center">
        <div className="text-xl font-semibold">{value}</div>
        <div
          className={`flex items-center text-sm ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span className="ml-1">{percentageChange}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
