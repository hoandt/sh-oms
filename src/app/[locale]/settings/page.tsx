"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  firstName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Settings() {
  const { data } = useSession();
  const information: UserSession = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: information?.userWithRole.email,
      lastName: information?.userWithRole.lastName || "",
      firstName: information?.userWithRole.firstName || "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
  }

  return (
    <div className="w-full mx-4 my-3">
      <Form {...form}>
        <h1 className="text-2xl">{"Thông tin tài khoản"}</h1>
        {/* Display trial account badge  */}
        <p className="text-sm text-gray-500">{"BASIC PACKAGE"}</p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-4 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* grid with 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className=" col-span-1">
              <FormField
                control={form.control}
                disabled={true}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="FirstName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" col-span-1">
              <FormField
                control={form.control}
                disabled={true}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input placeholder="LastName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button disabled={true} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
