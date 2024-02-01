import { cn } from "@/lib/utils";
import { TabSideBarInfor } from "@/types/common";
import { CheckCheckIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const StepperBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "";

  function handleChangeTab(tab: string) {
    router.push(`/outbounds/create?tab=${tab}`);
  }

  return (
    <ol className="space-y-4 w-72">
      <li
        className="cursor-pointer"
        onClick={() => handleChangeTab(TabSideBarInfor["CUSTOMER"])}
      >
        <div
          className={cn(
            "w-full p-4  border  rounded-lg bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400",
            tab === TabSideBarInfor["CUSTOMER"] &&
              "text-green-700 border-green-300"
          )}
          role="alert"
        >
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-medium">Thông tin khách hàng</h3>
          </div>
        </div>
      </li>
      <li
        className="cursor-pointer"
        onClick={() => handleChangeTab(TabSideBarInfor["TRACKING"])}
      >
        <div
          className={cn(
            "w-full p-4  border  rounded-lg bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400",
            tab === TabSideBarInfor["TRACKING"] &&
              "text-green-700 border-green-300"
          )}
          role="alert"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Vận chuyển</h3>
          </div>
        </div>
      </li>
      <li
        className="cursor-pointer"
        onClick={() => handleChangeTab(TabSideBarInfor["PRODUCT"])}
      >
        <div
          className={cn(
            "w-full p-4  border  rounded-lg bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400",
            tab === TabSideBarInfor["PRODUCT"] &&
              "text-green-700 border-green-300"
          )}
          role="alert"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Thông tin sản phẩm</h3>
          </div>
        </div>
      </li>
    </ol>
  );
};
