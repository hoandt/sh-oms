"use client";

import { CommonSidebar } from "./CommonSidebar";
import { CommonTopbar } from "./CommonTopbar";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/provider/SidebarProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export function CommonLayout({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebarContext();
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  return (
    <AnimatePresence>
      {isAuthenticated && <CommonSidebar />}
      <motion.div className={cn("lg:pl-20", toggleSidebar && "lg:pl-60")}>
        {isAuthenticated && <CommonTopbar />}
        <main>
          <div className="">{children}</div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
