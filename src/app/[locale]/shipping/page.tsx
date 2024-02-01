"use client";

import DeliveryTrackingForm from "./components/DeliveryTrackingForm";
import PickTrackingForm from "./components/PickTrackingForm";
import TableDelivery from "./components/TableDelivery";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { METHOD_DELIVERY } from "@/lib/config";
import { useOutbound } from "@/lib/store";
import { customersQueryKeys } from "@/query-keys";
import { getFeeTracking } from "@/services";
import { formShippingSchema } from "@/types/common";
import { DataResponseDeliveryMethod } from "@/types/customer";
import { AddressDistrict, AddressProvince } from "@/types/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

export default function Tracking() {
  const router = useRouter();
  const { setSelectedCustomerTracking } = useOutbound();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formShippingSchema>>({
    resolver: zodResolver(formShippingSchema),
    defaultValues: {
      address_delivery: "",
      address_province_delivery: 0,
      address_district_delivery: 0,
      address_ward_delivery: 0,

      address_pick: "",
      address_province_pick: 0,
      address_district_pick: 0,
      address_ward_pick: 0,
    },
  });

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formShippingSchema>) {
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

  return (
    <div className="w-full p-20 flex flex-col gap-5">
      <Form {...form}>
        <h1 className="text-2xl">{"Tracking Shipment"}</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="w-full flex flex-row gap-3">
            <PickTrackingForm />
            <DeliveryTrackingForm />
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

          <div className="flex flex-row gap-3">
            <Button className="w-full gap-2" type="submit">
              {mutationGetFee.isPending && (
                <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
              )}
              Tra cứu
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setSelectedCustomerTracking(form.getValues());
                router.push(`/outbounds/create`);
              }}
            >
              Tạo đơn
            </Button>
          </div>
        </form>
      </Form>

      {dataMethodDelivery && (
        <TableDelivery
          loading={mutationGetFee.isPending}
          data={dataMethodDelivery}
        />
      )}
    </div>
  );
}
