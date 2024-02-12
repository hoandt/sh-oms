import { Combobox } from "@/components/common/custom/Combobox";
import { DatePicker } from "@/components/common/custom/DatePicker";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { useFilterStore } from "@/lib/store";
import { useGetCustomers, useGetOrganization } from "@/query-keys";
import { DataOptions } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

export const formFilterInboundSchema = z.object({
  users: z.coerce.number().optional(),
  organization: z.coerce.number().optional(),
  date_from: z.coerce.number().optional(),
  date_to: z.coerce.number().optional(),
});

export const Filter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // const { addFilter } = useFilterStore();
  const form = useForm<z.infer<typeof formFilterInboundSchema>>({
    resolver: zodResolver(formFilterInboundSchema),
    defaultValues: {
      users: parseInt(searchParams.get("users") || "") || undefined,
      organization:
        parseInt(searchParams.get("organization") || "") || undefined,
      date_from: parseInt(searchParams.get("date_from") || "") || undefined,
      date_to: parseInt(searchParams.get("date_to") || "") || undefined,
    },
  });

  const { data, isLoading: loadingOrganization } = useGetOrganization({
    page: 0,
    pageSize: 99,
  });

  const { data: customerData, isLoading: loadingCustomer } = useGetCustomers({
    page: 0,
    pageSize: 99,
  });

  const dataOptionsOrganization = useMemo(() => {
    return data?.map((e) => {
      return {
        label: e.attributes.name,
        value: e.id,
      };
    });
  }, [data]) as DataOptions[];

  const dataOptionsCustomer = useMemo(() => {
    return customerData?.data?.map((e) => {
      return {
        label: e.attributes.name,
        value: e.id,
      };
    });
  }, [customerData]) as DataOptions[];

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
          isLoading={loadingCustomer}
          label="Users"
          placeholder="Users"
          name="users"
          dataOptions={dataOptionsCustomer}
        />

        <Combobox
          isLoading={loadingOrganization}
          label="Organization"
          placeholder="Organization"
          name="organization"
          dataOptions={dataOptionsOrganization}
        />

        <DatePicker
          isLoading={loadingOrganization}
          label="From"
          placeholder="Date"
          name="date_from"
          dataOptions={dataOptionsOrganization}
        />

        <DatePicker
          isLoading={loadingOrganization}
          label="To"
          placeholder="Date"
          name="date_to"
          dataOptions={dataOptionsOrganization}
        />

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
    </Form>
  );
};
