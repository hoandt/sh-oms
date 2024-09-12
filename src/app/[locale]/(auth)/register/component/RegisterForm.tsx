"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import * as z from "zod";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

export const registerSchema = z.object({
  username: z.string().min(2, {
    message: "at least 6 characters.",
  }),
  lastName: z.string().min(2, {
    message: "at least 2 characters.",
  }),
  firstName: z.string().min(2, {
    message: "at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "at least 6 characters.",
  }),
  referralCode: z.string().optional(),
  phone: z.string(),
  email: z.string(),
  captcha: z.string(),
});
export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const handleCaptcha = (token: string) => {
    setCaptchaToken(token);
    form.setValue("captcha", token);
  };
  const session = useSession();
  // If session exists, redirect to home
  if (session && session.data) {
    redirect("/");
    return null;
  }
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      lastName: "",
      firstName: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      phone: "",
      email: "",
      captcha: "",
    },
  });
  const { toast } = useToast();

  const params = useSearchParams();
  const referral = params.get("referral");

  useEffect(() => {
    referral && form.setValue("referralCode", referral);
  }, [referral]);

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    if (!captchaToken) {
      toast({
        title: "Error",
        description: "Please complete the CAPTCHA.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // check if password and confirm password match
    if (values.password !== values.confirmPassword) {
      setIsLoading(false);
      form.setError("confirmPassword", {
        type: "manual",
        message: "Password and Confirm Password must match",
      });
      return;
    }

    const res = await fetch("/api/controller/authentication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (data) {
      toast({
        title: "Success",
        description: "Account created successfully.",
      });
      //reset form
      form.reset();
      //redirect to login
      if (window) {
        window.location.href = "/login";
      }
    } else {
      toast({
        title: "Failed",
        description: "Registration failed. Please try again.",
        variant: "destructive",
        type: "foreground",
      });
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {/* 2 cols name and phone */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nguyen ABC"
                      {...field}
                      autoComplete="false"
                    />
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
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      {...field}
                      autoComplete="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Công ty</FormLabel>
                <FormControl>
                  <Input
                    placeholder="vd: fashionShop123, Mỹ phẩm ABC"
                    {...field}
                    autoComplete="false"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    autoComplete="false"
                    {...field}
                    // onchange set username
                    onChange={(e) => {
                      form.setValue("username", e.target.value.split("@")[0]);
                      form.setValue("email", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* confirm password*/}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* readonly referral code */}
          {referral && (
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input hidden placeholder="Referral" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <ReCAPTCHA
            sitekey="6LcIIUAqAAAAABUYj6ME4Db_7ttDoL701wNvuHoU"
            onChange={handleCaptcha as any}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <LoaderIcon size={16} className="animate-spin mr-2" />
            )}
            Tạo tài khoản
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}
