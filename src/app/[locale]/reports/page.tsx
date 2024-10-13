"use client";
import React from "react";
import { PriceOrderChart } from "./components/PriceOrderChart";
import ReportToday from "./components/ReportToday";
import { PriceOrderByChannel } from "./components/PriceOrderByChannel";
import Overview from "./components/Overview";
import BestSeller from "./components/BestSeller";
import { DatePickerWithRange } from "./components/DateRange";

const ReportPage = () => {
  return (
    <div className="flex flex-col gap-2 p-4">
      <DatePickerWithRange className="w-[300px]" />
      <div className="flex flex-row gap-2 w-full">
        <PriceOrderChart />
        <ReportToday />
      </div>
      <div className="flex flex-row gap-2">
        <Overview />
      </div>
      <div className="flex flex-row gap-2">
        <BestSeller />
      </div>
    </div>
  );
};

export default ReportPage;
