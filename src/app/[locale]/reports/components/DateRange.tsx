"use client";

import * as React from "react";
import { addDays, format, getUnixTime, parseISO } from "date-fns";
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
import { z } from "zod";
import { useQueryParams } from "@/hooks/useQueryParams";

function convertToUnixTimestamp(dateString: string): number {
  return getUnixTime(parseISO(dateString));
}

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const schema = z.object({
    from: z.number().nullish(),
    to: z.number().nullish(),
  });

  const { setQueryParams } = useQueryParams({
    schema,
    defaultValues: {
      from: null,
      to: null,
    },
  });

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
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
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(value) => {
              setQueryParams({
                from: convertToUnixTimestamp(value?.from?.toISOString()),
                to: convertToUnixTimestamp(value?.to?.toISOString()),
              });

              setDate(value);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
