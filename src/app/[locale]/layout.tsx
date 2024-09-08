import VersionManager from "@/components/common/custom/VersionManager";
import { cn } from "../../lib/utils";
import "../../styles/globals.css";
import { CommonLayout } from "@/components/common/layout/CommonLayout";
import { Toaster } from "@/components/ui/toaster";
import ReactAuthProvider from "@/provider/ReactAuthProvider";
import { ReactQueryProvider } from "@/provider/ReactQueryProvider";
import { SidebarProvider } from "@/provider/SidebarProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Roboto_Mono } from "next/font/google";
import { Be_Vietnam_Pro as FontSans } from "next/font/google";
import { ReactNode } from "react";

export const fontSans = FontSans({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});
const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Tracking Order System - SwiftSeller",
  description: "Hệ thống tracking order của SwiftSeller",
};
type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();

  return (
    <html lang={locale} className="h-full scroll-smooth">
      <body
        className={cn(
          "flex h-full flex-col bg-background font-sans antialiased bg-blue-50",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProvider>
            <ReactAuthProvider>
              <SidebarProvider>
                <CommonLayout>
                  {children}
                  <VersionManager />
                  <Toaster />
                </CommonLayout>
              </SidebarProvider>
            </ReactAuthProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
