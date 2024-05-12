import { Combobox } from "@/components/common/custom/Combobox";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { DataOptions } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formFilterInboundSchema = z.object({
  status: z.coerce.string().optional(),
});

const OptionsType = [
  { label: "Packing", value: "packing" },
  { label: "Inbound", value: "inbound" },
  { label: "Outbound", value: "outbound" },
  { label: "Return", value: "return" },
] as DataOptions[];

export const Filter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formFilterInboundSchema>>({
    resolver: zodResolver(formFilterInboundSchema),
    defaultValues: {
      status: searchParams.get("status") || OptionsType[0].value,
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
        <Combobox
          isLoading={false}
          label="Status"
          placeholder="Status"
          name="status"
          dataOptions={OptionsType}
        />

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
