"use client";

import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebarContext } from "@/provider/SidebarProvider";
import { CircleDashedIcon, CoinsIcon, ConeIcon, FileVideo } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
const TRIAL_LIMIT = 10;
export function CommonTopbar() {
  const { data } = useSession();
  const { setToggleSidebar } = useSidebarContext();
  const [credits, setCredits] = useState<number | string>("...");
  const userData = data as any;
  const organizationId = userData.userWithRole.organization.id;
  const isTrial = userData.userWithRole.isTrial;
  // get credts from api /api/reports?subscription=:id
  useEffect(() => {
    if (!organizationId) {
      signOut();
    }

    fetch("/api/reports?subscription=" + organizationId)
      .then((res) => res.json())
      .then((data: any) => {
        const usage = data.txt as number;
        //  if trial and usage > TRIAL_LIMIT then signOut
        if (isTrial && usage > TRIAL_LIMIT) {
          signOut();
        }
        setCredits(usage);
      });
  }, []);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setToggleSidebar?.((e) => !e)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div
        className="h-6 w-px bg-gray-900/10 lg:hidden"
        aria-hidden="true"
      ></div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* display usage limit. For example: 10/2000 credits with style  */}
          <div className="border gap-1 text-sm rounded shadow-sm text-gray-500 font-semibold px-2 inline-flex justify-center items-center">
            {isTrial && (
              <span>
                <FileVideo className="w-4 text-slate-400" />
                `${credits}/10`
              </span>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild className="cursor-pointer">
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                  aria-hidden="true"
                >
                  {data?.user?.email || "-"}
                </span>
                <svg
                  className="ml-2 h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <Link
                href={"/settings"}
                className="block px-2 py-1 text-sm leading-6 text-gray-900"
                role="menuitem"
                id="user-menu-item-0"
              >
                Cài đặt
              </Link>
              <a
                href="#"
                onClick={() => signOut()}
                className="block px-3 py-1 text-sm leading-6 text-red-500"
                role="menuitem"
                id="user-menu-item-1"
              >
                Thoát
              </a>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
