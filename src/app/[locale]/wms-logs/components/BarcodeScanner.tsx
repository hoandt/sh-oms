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
import { Loader2Icon } from "lucide-react";

const InboundIDScan = z.object({
  inboundID: z
    .string({ required_error: "Vui lòng nhập mã đơn nhập" })
    .min(1, { message: "Vui lòng nhập mã đơn nhập" }),
});

function BarcodeScanForm({
  isLoading,
  handleScan,
  isFocused,
}: {
  isFocused: boolean;
  isLoading: boolean;
  handleScan: (code: string) => void;
}) {
  const form = useForm<z.infer<typeof InboundIDScan>>({
    resolver: zodResolver(InboundIDScan),
    defaultValues: {
      inboundID: "",
    },
  });

  useEffect(() => {
    if (isFocused) {
      form.setFocus("inboundID");
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        form.setFocus("inboundID");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, form]);

  function onSubmit(values: z.infer<typeof InboundIDScan>) {
    form.setValue("inboundID", "");
    handleScan(values.inboundID);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="inboundID"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  required
                  autoComplete="off"
                  placeholder="Scan mã vận đơn"
                  {...field}
                  height={24}
                  className="text-xl px-4 py-8 w-full ring-1 ring-gray-300 rounded-md focus:ring-orange-500 outline-orange-100 focus:outline-none transition duration-200 ease-in-out"
                />
              </FormControl>
              <FormDescription className="relative mt-2">
                <span className={isLoading ? "opacity-0" : ""}>
                  Scan mã vận đơn trên phiếu giao hàng. Bấm{" "}
                  <span className="bg-white border rounded shadow px-1">
                    F9
                  </span>{" "}
                  để focus.
                </span>
                {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
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
