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
import { METHOD_DELIVERY } from "@/lib/constants";
import { customersQueryKeys } from "@/query-keys";
import { getFeeTracking } from "@/services";
import { DataResponseDeliveryMethod } from "@/types/customer";
import { AddressDistrict, AddressProvince } from "@/types/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  address_delivery: z.string().min(3, "Định dạng không đúng"),
  address_ward_delivery: z.coerce
    .number({ invalid_type_error: "Xin nhập phường/xã" })
    .gt(0, "Xin nhập"),
  address_district_delivery: z.coerce
    .number({ invalid_type_error: "Xin nhập quận/huyện" })
    .gt(0, "Xin nhập"),
  address_province_delivery: z.coerce
    .number({ invalid_type_error: "Xin nhập tỉnh/thành" })
    .gt(0, "Xin nhập"),
  object_delivery: z.any(),

  address_pick: z.string().min(3, "Định dạng không đúng"),
  address_ward_pick: z.coerce
    .number({ invalid_type_error: "Xin nhập phường/xã" })
    .gt(0, "Xin nhập"),
  address_district_pick: z.coerce
    .number({ invalid_type_error: "Xin nhập quận/huyện" })
    .gt(0, "Xin nhập"),
  address_province_pick: z.coerce
    .number({ invalid_type_error: "Xin nhập tỉnh/thành" })
    .gt(0, "Xin nhập"),
  object_pick: z.any(),

  weight: z.string(),
});

export default function Tracking() {
  const queryClient = useQueryClient();

  const [dataMethodDelivery, setDataMethodDelivery] = useState<
    DataResponseDeliveryMethod[]
  >([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
  function onSubmit(values: z.infer<typeof formSchema>) {
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
      // {
      //   name: METHOD_DELIVERY.VNP,
      //   payload: {
      //     address: `${values.address_delivery} ${wardDeliveryGHTK}`,
      //     province: provinceDeliveryGHTK,
      //     pick_province: provincePickGHTK,
      //     district: districtDeliveryGHTK,
      //     pick_district: distrcitPickGHTK,
      //     weight: values.weight,
      //   },
      // },
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
            <Button
              className="w-full"
              onClick={() => form.handleSubmit(onSubmit)()}
              type="submit"
            >
              {mutationGetFee.isPending && (
                <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
              )}
              Tra cứu
            </Button>
            <Button className="w-full" onClick={() => {}} type="submit">
              {mutationGetFee.isPending && (
                <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
              )}
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
