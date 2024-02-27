import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/provider/SidebarProvider";
import { motion } from "framer-motion";
import {
  BoxIcon,
  ContainerIcon,
  GalleryVerticalEndIcon,
  HardDriveUploadIcon,
  Laptop2Icon,
  Package2Icon,
  PieChartIcon,
  SearchIcon,
  SettingsIcon,
  TerminalSquareIcon,
  UserSquare2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const router = [
  {
    title: "Main",
    route: [
      {
        name: "Packing",
        icon: <BoxIcon />,
        href: "/wms-logs",
      },
      {
        name: "Giao dịch",
        icon: <SearchIcon />,
        href: "/history",
      },
    ],
  },
  {
    title: "More",
    route: [
      {
        name: "Cài đặt",
        icon: <SettingsIcon />,
        href: "/settings",
      },
    ],
  },
];

export function CommonSidebar() {
  const { toggleSidebar, setToggleSidebar } = useSidebarContext();
  const path = usePathname();

  function handleExpand() {
    setToggleSidebar?.((e) => !e);
  }

  return (
    <div
      className={cn(
        "fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-18 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4",
        toggleSidebar && "lg:w-60"
      )}
    >
      <div
        className="flex h-16 shrink-0 items-center justify-center"
        onClick={handleExpand}
      >
        <img
          className="h-16 pt-2 w-auto"
          src="https://app.swifthub.net/swifthub.svg"
          alt="SwiftHub"
        />
      </div>
      <nav className="mt-8">
        <ul role="list" className="flex flex-col items-center gap-2 p-3">
          {router.map((value, index) => {
            return (
              <li key={index} className="w-full">
                <span className="text-slate-700 font-bold"> {value.title}</span>
                <div className="flex flex-col gap-2">
                  {value.route.map((valueP, indexP) => {
                    const active = path.includes(valueP.href);
                    return (
                      <Link
                        key={indexP}
                        href={valueP.href}
                        className={cn(
                          " text-white group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold",
                          active && "bg-gray-800"
                        )}
                      >
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {valueP.icon}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <span>{valueP.name}</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className={cn(toggleSidebar ? "" : "sr-only")}>
                          {valueP.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
