"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterStore } from "@/lib/store";
import { Trash2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";

const FormSchema = z.object({
  type: z.string(),
});

export function SavedFilterSheet() {
  const { filter, selectedFilter, setSelectdFilter, removeFilter } =
    useFilterStore();
  const router = useRouter();
  const pathname = usePathname();
  const specificFilter = filter.filter((e) => e.page.includes(pathname))[0];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const query = filter
      .filter((e) => e.page.includes(pathname))[0]
      .data.find((e) => e.id === data.type)?.value;
    router.push(`${pathname}?${query}`);
  }

  function onRemove(id: string) {
    removeFilter(pathname, id);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectdFilter(value);
                  }}
                  value={selectedFilter}
                  className="flex flex-col gap-5"
                >
                  {specificFilter?.data.map((e, index) => {
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-full flex items-center gap-2">
                          <RadioGroupItem value={e.id} />
                          <div className="w-full">{e.name}</div>
                        </div>

                        <div onClick={() => onRemove(e.id)}>
                          <Trash2Icon />
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Chọn</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
