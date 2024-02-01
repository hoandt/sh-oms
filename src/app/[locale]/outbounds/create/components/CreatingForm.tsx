import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useOutbound } from "@/lib/store";
import { customersQueryKeys } from "@/query-keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package2Icon, TruckIcon, UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import PickTrackingForm from "./PickTrackingForm";
import DeliveryTrackingForm from "./DeliveryTrackingForm";
import TableDelivery from "./TableDelivery";
import InventoryTable from "./InventoryTable";
import { useRouter, useSearchParams } from "next/navigation";
import { TabSideBarInfor, formShippingSchema } from "@/types/common";
import { getFeeTracking } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { METHOD_DELIVERY } from "@/lib/config";
import { AddressDistrict, AddressProvince } from "@/types/todo";
import { DataResponseDeliveryMethod } from "@/types/customer";

const schema = formShippingSchema.and(
  z.object({
    userName: z.string().optional(),
    phone: z.string().optional(),
  })
);

export const CreatingForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "";
  const { selectedCustomerTracking } = useOutbound();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      address_delivery: selectedCustomerTracking.address_delivery,
      address_province_delivery:
        selectedCustomerTracking.address_province_delivery || 0,
      address_district_delivery:
        selectedCustomerTracking.address_district_delivery || 0,
      address_ward_delivery:
        selectedCustomerTracking.address_ward_delivery || 0,
      object_delivery: selectedCustomerTracking.object_delivery,

      address_pick: selectedCustomerTracking.address_pick,
      address_province_pick:
        selectedCustomerTracking.address_province_pick || 0,
      address_district_pick:
        selectedCustomerTracking.address_district_pick || 0,
      address_ward_pick: selectedCustomerTracking.address_ward_pick || 0,
      object_pick: selectedCustomerTracking.object_pick,

      weight: selectedCustomerTracking.weight,
    },
  });
  const isShowTracking = form.formState.isValid;

  const [dataMethodDelivery, setDataMethodDelivery] = useState<
    DataResponseDeliveryMethod[]
  >([]);

  const mutationGetFee = useMutation({
    mutationFn: (values: any) => {
      return getFeeTracking({ options: values });
    },
    onSuccess: (data) => {
      if (data) {
        setDataMethodDelivery(data as any);
      }
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    const stateDistrictPick = queryClient.getQueryData(
      customersQueryKeys.getDistricts(values.address_province_pick)
    ) as AddressDistrict[];
    const stateDistrictDelivery = queryClient.getQueryData(
      customersQueryKeys.getDistricts(values.address_province_delivery)
    ) as AddressDistrict[];

    const stateProvince = queryClient.getQueryData(
      customersQueryKeys.getProvinces()
    ) as AddressProvince[];

    const provinceDeliveryGHTK = stateProvince?.find(
      (province) => province.id === values.address_province_delivery
    )?.attributes.name;
    const provincePickGHTK = stateProvince?.find(
      (province) => province.id === values.address_province_pick
    )?.attributes.name;

    const distrcitPickGHTK = stateDistrictPick?.find(
      (district) => district.id === values.address_district_pick
    )?.attributes.name;
    const districtDeliveryGHTK = stateDistrictDelivery?.find(
      (district) => district.id === values.address_district_delivery
    )?.attributes.name;
    const wardDeliveryGHTK = values.object_pick.attributes.name;

    const ghnAddressPick =
      values.object_pick.attributes.carrierCodes.ghn?.split("_");
    const ghnAddressDelivery =
      values.object_delivery.attributes.carrierCodes.ghn?.split("_");

    const vnpostAddressPick =
      values.object_pick.attributes.carrierCodes.vnpost?.split("_");
    const vnpostAddressDelivery =
      values.object_delivery.attributes.carrierCodes.vnpost?.split("_");

    const payload = [
      {
        name: METHOD_DELIVERY.GHN,
        payload: {
          shop_id: 125464,
          service_id: 53320,
          from_district_id: parseInt(ghnAddressPick[1]),
          to_district_id: parseInt(ghnAddressDelivery[1]),
          from_ward_code: ghnAddressPick[2],
          to_ward_code: ghnAddressDelivery[2],
          weight: parseInt(values.weight),
          items: [],
        },
      },
      {
        name: METHOD_DELIVERY.GHTK,
        payload: {
          address: `${values.address_delivery} ${wardDeliveryGHTK}`,
          province: provinceDeliveryGHTK,
          pick_province: provincePickGHTK,
          district: districtDeliveryGHTK,
          pick_district: distrcitPickGHTK,
          weight: values.weight,
        },
      },
      {
        name: METHOD_DELIVERY.VNP,
        payload: {
          scope: 1,
          customerCode: "C000368268",
          data: {
            senderProvinceCode: vnpostAddressPick[0],
            senderDistrictCode: vnpostAddressPick[1],
            senderCommuneCode: vnpostAddressPick[2],
            receiverAddress: `${values.address_delivery}`,
            receiverProvinceCode: vnpostAddressDelivery[0],
            receiverDistrictCode: vnpostAddressDelivery[1],
            receiverCommuneCode: vnpostAddressDelivery[2],
            weight: values.weight,
            serviceCode: "CTN007",
            addonService: [],
            additionRequest: [],
            vehicle: "BO",
          },
        },
      },
    ];

    mutationGetFee.mutate(payload);
  }

  console.log({ mutationGetFee: mutationGetFee.isPending });

  useEffect(() => {
    const values = form.getValues();
    if (isShowTracking && tab === TabSideBarInfor["TRACKING"]) {
      onSubmit(values);
    }
  }, [isShowTracking, tab]);

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-8">
          <Accordion
            value={tab}
            onValueChange={(value) => {
              if (!value) {
                return router.push(`/outbounds/create`);
              }
              return router.push(`/outbounds/create?tab=${value}`);
            }}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem
              value={TabSideBarInfor["CUSTOMER"]}
              className="group px-4 bg-white rounded"
            >
              <AccordionTrigger>
                <div className="flex flex-row gap-2">
                  <UserRound />
                  Thông tin khách hàng
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-4 shadow">
                <div className="w-full flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UserName</FormLabel>
                        <FormControl>
                          <Input placeholder="UserName" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{"Phone"}</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-row gap-3">
                    <div className="w-full flex flex-col gap-2">
                      <PickTrackingForm />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <DeliveryTrackingForm />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trọng lượng</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            required
                            placeholder="Trọng lượng..."
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value={TabSideBarInfor["TRACKING"]}
              className="group px-4 bg-white rounded"
            >
              <AccordionTrigger>
                <div className="flex flex-row gap-2">
                  <TruckIcon />
                  Vận chuyển
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-4 shadow">
                <TableDelivery
                  loading={mutationGetFee.isPending}
                  data={dataMethodDelivery}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value={TabSideBarInfor["PRODUCT"]}
              className="group px-4 bg-white rounded"
            >
              <AccordionTrigger>
                <div className="flex flex-row gap-2">
                  <Package2Icon />
                  Thông tin sản phẩm
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 shadow">
                <div className="sm:flex sm:items-center print:hidden">
                  <div className="sm:flex-auto">
                    <p className="mt-2 text-sm text-gray-700">
                      Danh sách sản phẩm cần xuất kho
                    </p>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-blue-500 text-blue-50"
                          variant={"outline"}
                        >
                          Thêm sản phẩm
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl overflow-scroll">
                        <AlertDialogHeader>
                          <DialogDescription asChild>
                            <div className="max-h-[640px] overflow-scroll relative pt-0 pb-6">
                              <div className="text-base text-gray-900">
                                <h1 className="px-3 text-xl text-gray-500">
                                  Sản phẩm có thể xuất
                                </h1>
                              </div>
                              <InventoryTable />
                              <div className="w-full fixed flex justify-end bottom-0 left-0 bg-slate-100 px-4 py-2">
                                <DialogClose asChild>
                                  <Button variant={"default"}>Xác nhận</Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogDescription>
                        </AlertDialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            type="submit"
            className="mr-2 ring-1 text-orange-50 ring-slate-300 bg-orange-500 hover:text-slate-100 hover:bg-orange-400"
          >
            Tạo đơn xuất
          </Button>
        </form>
      </Form>
    </div>
  );
};
