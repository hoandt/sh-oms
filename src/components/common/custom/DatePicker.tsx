import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DataOptions } from "@/types/common";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CalendarIcon, ChevronDown, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";

export const DatePicker = ({
  isLoading,
  dataOptions,
  onCallback,
  placeholder = "Chọn",
  name,
  label = "",
}: {
  isLoading: boolean;
  dataOptions: DataOptions[];
  onCallback?: any;
  placeholder?: string;
  name: string;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  const form = useFormContext();

  const value = useWatch({
    control: form.control,
    name,
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={(e) => setOpen(e)}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-fill justify-between bg-white")}
                >
                  <div className="flex flex-row gap-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "dd/MM/yyyy") : placeholder}
                  </div>
                  {isLoading ? (
                    <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(e) => {
                  form.setValue(name, e, {
                    shouldDirty: true,
                  });
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
