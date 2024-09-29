"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode, useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const CACHE_KEY = "QUERY_CACHE";
  const [persister, setPersister] = useState<any>(null);

  useEffect(() => {
    // Ensure localStorage is only accessed on the client-side
    if (typeof window !== "undefined") {
      setPersister(
        createSyncStoragePersister({
          key: CACHE_KEY,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  // Only render PersistQueryClientProvider when persister is available
  if (!persister) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: Infinity,
      }}
    >
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      {children}
    </PersistQueryClientProvider>
  );
};
