import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/provider/SidebarProvider";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftSquare,
  ArrowRightSquare,
  BoxIcon,
  HandIcon,
  PanelTopInactiveIcon,
  RotateCcwIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const router = [
  {
    title: "CAM",
    route: [
      {
        name: "Inbound",
        icon: <ArrowRightSquare />,
        href: "/wms-logs/inbound",
      },

      {
        name: "Packing",
        icon: <BoxIcon />,
        href: "/wms-logs",
      },
      {
        name: "Outbound",
        icon: <ArrowLeftSquare />,
        href: "/wms-logs/outbound",
      },
      {
        name: "Return",
        icon: <RotateCcwIcon />,
        href: "/wms-logs/returns",
      },

      {
        name: "Logs",
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
    <AnimatePresence>
      <motion.div
        initial={{ width: "0" }}
        animate={{ width: toggleSidebar ? "15rem" : "4.3rem" }}
        exit={{ width: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed hidden lg:inset-y-0 lg:left-0 z-50 sm:block lg:w-18  overflow-y-auto bg-gray-900 lg:pb-4 pb-20 rounded-b-md",
          toggleSidebar && "block w-18 "
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
                  <span className="text-slate-700 font-bold">
                    {value.title}
                  </span>
                  <div className="flex flex-col gap-2">
                    {value.route.map((valueP, indexP) => {
                      const active = path === valueP.href;

                      return (
                        <Link
                          key={indexP}
                          href={valueP.href}
                          onClick={() => {
                            setToggleSidebar?.(false);
                          }}
                          className={cn(
                            " text-white group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold",
                            active && "bg-gray-800 text-orange-500"
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
      </motion.div>
    </AnimatePresence>
  );
}
