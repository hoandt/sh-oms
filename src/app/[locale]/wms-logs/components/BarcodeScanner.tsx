"use client";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const InboundIDScan = z.object({
  inboundID: z
    .string({ required_error: "Vui lòng nhập mã đơn nhập" })
    .min(1, { message: "Vui lòng nhập mã đơn nhập" }),
});

function BarcodeScanForm({
  handleScan,
}: {
  handleScan: (code: string) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { toast, dismiss } = useToast();
  const form = useForm<z.infer<typeof InboundIDScan>>({
    resolver: zodResolver(InboundIDScan),
    defaultValues: {
      inboundID: "",
    },
  });
  useEffect(() => {
    form.setFocus("inboundID");
  }, [form]);
  useEffect(() => {}, []);
  function onSubmit(values: z.infer<typeof InboundIDScan>) {
    form.setValue("inboundID", "");
    handleScan(values.inboundID);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  "
        //alway set focus on input inboundID
      >
        <FormField
          control={form.control}
          name="inboundID"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Scan mã vận đơn"
                  {...field}
                  height={24}
                  className="text-xl px-4 py-8 w-full"
                />
              </FormControl>
              <FormDescription className="relative mt-2">
                <span className={cn(loading ? "opacity-0" : "")}>
                  Scan mã vận đơn trên phiếu giao hàng
                </span>
                {loading && <>loading...</>}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default BarcodeScanForm;
