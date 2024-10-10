"use client";
import { useState } from "react";
import OrdersTable from "./OrdersTable";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function SalesChannel() {
  const [SalesChannel, setSalesChannel] = useState<any>([
    { name: "Shopee", href: "#", count: "52", current: true },
    { name: "Tiktok", href: "#", count: "6", current: false },
    { name: "Lazada", href: "#", count: "4", current: false },
  ]);

  // Track the currently selected marketplace
  const [currentMarketplace, setCurrentMarketplace] = useState(
    SalesChannel.find((tab: any) => tab.current)?.name || ""
  );

  const handleTabClick = (tabName: string) => {
    setSalesChannel((prevChannels: any) =>
      prevChannels.map((tab: any) =>
        tab.name === tabName
          ? { ...tab, current: true }
          : { ...tab, current: false }
      )
    );
    // Update the current marketplace name
    setCurrentMarketplace(tabName);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          defaultValue={SalesChannel.find((tab: any) => tab.current).name}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
          onChange={(e) => handleTabClick(e.target.value)}
        >
          {SalesChannel.map((tab: any) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {SalesChannel.map((tab: any) => (
              <a
                key={tab.name}
                href="#"
                onClick={() => handleTabClick(tab.name)}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.current
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                  "flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                )}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-900",
                      "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block"
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Pass currentMarketplace as a prop to Orders component */}
      <OrdersTable saleChannel={currentMarketplace} />
    </div>
  );
}
