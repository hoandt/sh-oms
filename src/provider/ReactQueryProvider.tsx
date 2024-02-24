"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const CACHE_KEY = "QUERY_CACHE";
const persister = createSyncStoragePersister({
  key: CACHE_KEY,
  storage: window.localStorage,
});

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: Infinity,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const needPersistance =
              query.queryKey.includes("get-customers") ||
              query.queryKey.includes("get-organization");

            return needPersistance;
          },
        },
      }}
    >
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      {children}
    </PersistQueryClientProvider>
  );
};
