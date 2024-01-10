"use client";

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
  ContainerIcon,
  GalleryVerticalEndIcon,
  Laptop2Icon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const router = [
  {
    name: "Inbound",
    icon: <ContainerIcon />,
    href: "/inbounds",
  },
  {
    name: "Outbound",
    icon: <GalleryVerticalEndIcon />,
    href: "/outbounds",
  },
  {
    name: "Inventory",
    icon: <Laptop2Icon />,
    href: "/inventories",
  },
  {
    name: "Setting",
    icon: <SettingsIcon />,
    href: "/settings",
  },
];

export function CommonSidebar() {
  const { toggleSidebar, setToggleSidebar } = useSidebarContext();

  function handleExpand() {
    setToggleSidebar?.((e) => !e);
  }
  return (
    <div
      className={cn(
        "lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-18 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4",
        toggleSidebar && "lg:w-60"
      )}
    >
      <div
        className="flex h-16 shrink-0 items-center justify-center"
        onClick={handleExpand}
      >
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
      </div>
      <nav className="mt-8">
        <ul role="list" className="flex flex-col items-center gap-2 p-3">
          {router.map((value, index) => {
            return (
              <li key={index} className=" w-full">
                <Link
                  href={value.href}
                  className="bg-gray-800 text-white group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>{value.icon}</TooltipTrigger>
                      <TooltipContent side="right">
                        <span>{value.name}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className={cn(toggleSidebar ? "" : "sr-only")}>
                    {value.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
