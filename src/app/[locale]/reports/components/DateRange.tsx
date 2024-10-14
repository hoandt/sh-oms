"use client";

import * as React from "react";
import { format, getUnixTime, parseISO, startOfDay, subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  if (dateString) {
    return getUnixTime(parseISO(dateString));
  }
}

function getPresetRange(option: string): DateRange | undefined {
  const today = startOfDay(new Date());

  switch (option) {
    case "Today":
      return { from: today, to: today };
    case "Yesterday":
      const yesterday = subDays(today, 1);
      return { from: yesterday, to: yesterday };
    case "Last 7 Days":
      return { from: subDays(today, 7), to: today };
    case "Last 30 Days":
      return { from: subDays(today, 30), to: today };
    default:
      return undefined;
  }
}

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const schema = z.object({
    from: z.number().nullish(),
    to: z.number().nullish(),
  });
  const defaultRange = getPresetRange("Last 7 Days");

  const { setQueryParams } = useQueryParams({
    schema,
    defaultValues: {
      from: convertToUnixTimestamp(defaultRange.from?.toISOString() || ""),
      to: convertToUnixTimestamp(defaultRange.to?.toISOString() || ""),
    },
  });

  // Set the default date range to "Last 7 Days"
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [date, setDate] = React.useState<DateRange | undefined>(defaultRange);
  const [activePreset, setActivePreset] = React.useState<string | null>(
    "Last 7 Days"
  );
  //useEffect to handle the query params defaultRange
  React.useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    const from = convertToUnixTimestamp(defaultRange.from?.toISOString() || "");
    const to = convertToUnixTimestamp(defaultRange.to?.toISOString() || "");
    console.log(from, to);

    const search = "?" + current.toString();
    console.log(search);

    const query = search ? `${search}` : "";

    router.push(`${pathname}${query}`);
  }, []);

  const handlePresetSelect = (option: string) => {
    const selectedRange = getPresetRange(option);
    if (selectedRange) {
      setQueryParams({
        from: convertToUnixTimestamp(selectedRange.from?.toISOString() || ""),
        to: convertToUnixTimestamp(selectedRange.to?.toISOString() || ""),
      });
      setDate(selectedRange);
      setActivePreset(option); // Set the active preset when user selects
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex gap-2 mb-2">
        {["Today", "Yesterday", "Last 7 Days", "Last 30 Days"].map((option) => (
          <Button
            key={option}
            variant={activePreset === option ? "secondary" : "outline"}
            onClick={() => handlePresetSelect(option)}
          >
            {option}
          </Button>
        ))}
      </div>
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
              console.log({ first: value?.to });
              setQueryParams({
                from: convertToUnixTimestamp(value?.from?.toISOString()),
                to: convertToUnixTimestamp(value?.to?.toISOString()),
              });

              setDate(value);
              setActivePreset(null); // Clear active preset when manually selecting a date
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
