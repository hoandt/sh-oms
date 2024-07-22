import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePickerWithRange } from "./DateRange";
import { Label } from "@/components/ui/label";

export const formFilterInboundSchema = z.object({
  created_on_max: z.coerce.string().nullish(),
  created_on_min: z.coerce.string().nullish(),
  brand_ids: z.coerce.string().nullish(),
  category_ids: z.coerce.string().nullish(),
});

export const Filter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formFilterInboundSchema>>({
    resolver: zodResolver(formFilterInboundSchema),
    defaultValues: {
      created_on_max: searchParams.get("created_on_max") || undefined,
      created_on_min: searchParams.get("created_on_min") || undefined,
      category_ids: searchParams.get("category_ids") || undefined,
      brand_ids: searchParams.get("brand_ids") || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formFilterInboundSchema>) {
    const queryOptions = qs.stringify(values, {
      encodeValuesOnly: true,
      addQueryPrefix: true,
    });

    router.push(`${pathname}${queryOptions}`);
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4 mt-5">
        <div className="flex flex-col gap-2">
          <Label>{"Date"}</Label>
          <DatePickerWithRange className="w-full" />
        </div>

        <div className="flex flex-row gap-2">
          <SheetFooter>
            <SheetClose asChild>
              <Button
                className="w-full gap-2"
                onClick={() => form.handleSubmit(onSubmit)()}
                type="submit"
              >
                Lọc
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </div>
    </Form>
  );
};