"use client";

import * as React from "react";
import { addDays, addHours, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const form = useFormContext();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: form.getValues("created_on_min") || addDays(new Date(), -10),
    to: form.getValues("created_on_max") || new Date(),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-row gap-2 px-4 mt-2">
            <Button
              variant={"outline"}
              size="sm"
              onClick={() => {
                const today = new Date();
                //set today 00:00:00
                today.setHours(0, 0, 0, 0);

                form.setValue(
                  "created_on_max",
                  formatDateTimeWithoutMilliseconds(addDays(today, 1))
                );
                form.setValue(
                  "created_on_min",
                  formatDateTimeWithoutMilliseconds(today)
                );
                setDate({ from: today, to: addDays(today, 1) });
              }}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => {
                const yesterday = addDays(new Date(), -1);
                //set yesterday 00:00:00
                yesterday.setHours(0, 0, 0, 0);
                form.setValue(
                  "created_on_max",
                  formatDateTimeWithoutMilliseconds(addHours(yesterday, 23))
                );
                form.setValue(
                  "created_on_min",
                  formatDateTimeWithoutMilliseconds(yesterday)
                );
                setDate({ from: yesterday, to: addHours(yesterday, 23) });
              }}
            >
              Yesterday
            </Button>
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => {
                const startOfWeek = new Date();
                startOfWeek.setDate(
                  startOfWeek.getDate() - startOfWeek.getDay()
                );
                form.setValue(
                  "created_on_max",
                  formatDateTimeWithoutMilliseconds(new Date())
                );
                form.setValue(
                  "created_on_min",
                  formatDateTimeWithoutMilliseconds(startOfWeek)
                );
                setDate({ from: startOfWeek, to: new Date() });
              }}
            >
              This week
            </Button>
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => {
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                form.setValue(
                  "created_on_max",
                  formatDateTimeWithoutMilliseconds(new Date())
                );
                form.setValue(
                  "created_on_min",
                  formatDateTimeWithoutMilliseconds(startOfMonth)
                );
                setDate({ from: startOfMonth, to: new Date() });
              }}
            >
              This month
            </Button>
          </div>
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(value) => {
              form.setValue(
                "created_on_max",
                formatDateTimeWithoutMilliseconds(value?.to || new Date())
              );
              form.setValue(
                "created_on_min",
                formatDateTimeWithoutMilliseconds(value?.from || new Date())
              );
              setDate(value);
            }}
            numberOfMonths={2}
          />
          {/* display Ok button to close PopoverContent  */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
function formatDateTimeWithoutMilliseconds(dateTime: Date) {
  //return empty string if dateTime is undefined
  return dateTime.toISOString().replace(/\.\d{3}Z$/, "Z");
}