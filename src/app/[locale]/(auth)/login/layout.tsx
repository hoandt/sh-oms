import auth from "@/auth";
import { getServerSession } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(auth);

  if (session) redirect("/");
  return <>{children}</>;
};

export default Layout;
