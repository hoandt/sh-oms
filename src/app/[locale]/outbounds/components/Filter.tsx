import { Combobox } from "@/components/common/custom/Combobox";
import { DatePicker } from "@/components/common/custom/DatePicker";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { useFilterStore } from "@/lib/store";
import { useGetOrganization } from "@/query-keys";
import { DataOptions } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

export const formFilterInboundSchema = z.object({
  organization: z.coerce.number().optional(),
  date_from: z.coerce.number().optional(),
});

export const Filter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formFilterInboundSchema>>({
    resolver: zodResolver(formFilterInboundSchema),
    defaultValues: {
      organization: parseInt(searchParams.get("organization") || "") || 0,
      date_from: parseInt(searchParams.get("date_from") || "") || undefined,
    },
  });

  const { data, isLoading: loadingOrganization } = useGetOrganization({
    page: 0,
    pageSize: 100,
  });

  const dataOptionsOrganization = useMemo(() => {
    return data?.map((e) => {
      return {
        label: e.attributes.name,
        value: e.id,
      };
    });
  }, [data]) as DataOptions[];

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
          isLoading={loadingOrganization}
          label="Organization"
          placeholder="Organization"
          name="organization"
          dataOptions={dataOptionsOrganization}
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
