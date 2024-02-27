"use client";

import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
  const locale = useLocale();
  const t = useTranslations("Login");
  const [error, setError] = useState<string>();
  const router = useRouter();
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (error) setError(undefined);

    const formData = new FormData(event.currentTarget);
    signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        setError(result.error);
      } else {
        //  refresh page to get session
        router.refresh();
      }
    });
  }

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <div className="w-1/4 flex flex-col">
        <div className="flex w-full">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
        </div>
        <h2 className="mt-20 text-lg font-semibold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-orange-600 hover:underline"
          >
            Sign up
          </Link>{" "}
          for a free trial.
        </p>
        <form
          action="/api/auth/callback/credentials"
          className="space-y-6"
          method="POST"
          onSubmit={onSubmit}
        >
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              UserName
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="username"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                {/* <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a> */}
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
