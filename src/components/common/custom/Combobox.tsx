import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DataOptions } from "@/types/common";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDown, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export const Combobox = ({
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
  label?: string;
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
          {label && <FormLabel>{label}</FormLabel>}
          <Popover open={open} onOpenChange={(e) => setOpen(e)}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-fill justify-between bg-white")}
                >
                  {value
                    ? dataOptions?.find((option) => option.value === value)
                        ?.label
                    : placeholder}
                  {isLoading ? (
                    <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-fill p-0">
              <Command className="w-fill">
                <CommandInput
                  placeholder={`Tìm ${label}...`}
                  className="h-9 w-fill"
                />
                <CommandGroup className="w-fill p-2">
                  <ScrollArea className="h-[200px] rounded-md border overflow-scroll">
                    {dataOptions?.map((options: any) => (
                      <CommandItem
                        value={options.value}
                        key={options.value}
                        onSelect={() => {
                          form.setValue(name, options.value, {
                            shouldDirty: true,
                          });
                          setOpen(false);
                        }}
                      >
                        {options.label}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
