import { Card } from "@/components/ui/card";
import { formatNumberWithCommas } from "@/lib/helpers";

interface PlatformCardProps {
  platform: string;
  value: string;
  color: string; // For the dot color
  bgColor: string; // Background color of the card
}

export function PlatformCard({
  platform,
  value,
  color,
  bgColor,
}: PlatformCardProps) {
  return (
    <Card className={`flex items-center p-2 rounded-full ${bgColor} w-full`}>
      <div className="flex items-center space-x-2">
        <span
          className={`w-2.5 h-2.5 rounded-full`}
          style={{ backgroundColor: color }}
        ></span>
        <span className="text-gray-800 font-semibold">{platform}</span>
      </div>
      <div className="ml-auto text-gray-900 font-bold">
        {formatNumberWithCommas(Number(value))}
      </div>
    </Card>
  );
}
