import auth from "@/auth";
import { SlimLayout } from "@/components/SlimLayout";
import { getServerSession } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(auth);

  if (session) redirect("/");
  return <SlimLayout>{children}</SlimLayout>;
};

export default Layout;
