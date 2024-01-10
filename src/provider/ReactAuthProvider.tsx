"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const ReactAuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ReactAuthProvider;
