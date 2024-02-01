"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useGetDistricts, useGetProvinces, useGetWards } from "@/query-keys";
import { ChevronDown, Loader2Icon } from "lucide-react";
import React from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";

export default function PickTrackingForm() {
  const [open, setOpen] = React.useState({
    address_province_pick: false,
    address_district_pick: false,
    address_ward_pick: false,
  });

  const form = useFormContext();

  const provinceId = useWatch({
    control: form.control,
    name: "address_province_pick",
  });
  const districtId = useWatch({
    control: form.control,
    name: "address_district_pick",
  });

  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvinces();
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistricts({
    provinceId,
  });
  const { data: wards, isLoading: isLoadingWards } = useGetWards({
    districtId,
  });

  return (
    <div className="w-full space-y-8 mt-4">
      <div className="col-span-1">
        <FormField
          control={form.control}
          name="address_province_pick"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tỉnh thành Gửi</FormLabel>
              <Popover
                open={open.address_province_pick}
                onOpenChange={(e) => {
                  setOpen((prev) => ({
                    ...prev,
                    address_province_pick: e,
                  }));
                }}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between bg-white",
                        !field.value && "text-gray-400"
                      )}
                    >
                      {field.value
                        ? provinces?.find(
                            (province) => province.id === field.value
                          )?.attributes.name
                        : "Chọn tỉnh thành"}
                      {isLoadingProvinces ? (
                        <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command className=" w-fill">
                    <CommandInput
                      placeholder="Tìm tỉnh thành..."
                      className="h-9 w-fill"
                    />
                    <CommandEmpty>Không có kết quả</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[200px] rounded-md border">
                        {provinces?.map((province) => (
                          <CommandItem
                            value={province.attributes.aliases}
                            key={province.id}
                            onSelect={() => {
                              form.clearErrors("address_province_pick");
                              form.setValue(
                                "address_province_pick",
                                parseInt(`${province.id}`),
                                {
                                  shouldDirty: true,
                                }
                              );
                              form.setValue("address_district_pick", 0);
                              form.setValue("address_ward_pick", 0);
                              setOpen((prev) => ({
                                ...prev,
                                address_province_pick: false,
                              }));
                            }}
                          >
                            {province.attributes.name}
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
      </div>
      <div className="col-span-1">
        <FormField
          control={form.control}
          name="address_district_pick"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Quận/Huyện Gửi</FormLabel>
              <Popover
                open={open.address_district_pick}
                onOpenChange={(e) =>
                  setOpen((prev) => ({
                    ...prev,
                    address_district_pick: e,
                  }))
                }
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-fill justify-between bg-white",
                        !field.value && "text-gray-400"
                      )}
                    >
                      {field.value
                        ? districts?.find(
                            (district) => district.id === field.value
                          )?.attributes.name
                        : "Chọn quận huyện"}
                      {isLoadingDistricts ? (
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
                      placeholder="Tìm quận huyện..."
                      className="h-9 w-fill"
                    />
                    <CommandEmpty>Chọn tỉnh thành trước</CommandEmpty>
                    <CommandGroup className="w-fill">
                      <ScrollArea className="h-[200px] rounded-md border overflow-scroll">
                        {districts?.map((district) => (
                          <CommandItem
                            value={district.attributes.aliases}
                            key={district.id}
                            onSelect={() => {
                              form.clearErrors("address_district_pick");
                              form.setValue(
                                "address_district_pick",
                                parseInt(`${district.id}`),
                                {
                                  shouldDirty: true,
                                }
                              );
                              form.setValue("address_ward_pick", 0);
                              setOpen((prev) => ({
                                ...prev,
                                address_district_pick: false,
                              }));
                            }}
                          >
                            {district.attributes.name}
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
      </div>
      <div className="col-span-1">
        <FormField
          control={form.control}
          name="address_ward_pick"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Phường/Xã Gửi</FormLabel>
              <Popover
                open={open.address_ward_pick}
                onOpenChange={(e) =>
                  setOpen((prev) => ({ ...prev, address_ward_pick: e }))
                }
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-fill justify-between bg-white",
                        !field.value && "text-gray-400"
                      )}
                    >
                      {field.value
                        ? wards?.find((ward) => ward.id === field.value)
                            ?.attributes.name
                        : "Chọn xã"}
                      {isLoadingWards ? (
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
                      placeholder="Tìm phường xã..."
                      className="h-9 w-fill"
                    />
                    <CommandGroup className="w-fill">
                      <ScrollArea className="h-[200px] rounded-md border overflow-scroll ">
                        {wards?.map((ward) => (
                          <CommandItem
                            value={ward.attributes.aliases}
                            key={ward.id}
                            onSelect={() => {
                              form.clearErrors("address_ward_pick");
                              form.setValue(
                                "address_ward_pick",
                                parseInt(`${ward.id}`),
                                {
                                  shouldDirty: true,
                                }
                              );
                              form.setValue("object_pick", ward, {
                                shouldDirty: true,
                              });
                              setOpen((prev) => ({
                                ...prev,
                                address_ward_pick: false,
                              }));
                            }}
                          >
                            {ward.attributes.name}
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
      </div>
      <div className="col-span-2">
        <FormField
          control={form.control}
          name="address_pick"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ Gửi</FormLabel>
              <FormControl>
                <Input required placeholder="Số nhà, tên đường" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
