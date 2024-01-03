"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/Logo";
import { SlimLayout } from "@/components/SlimLayout";
import { type Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Sign In",
// };

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
        // router.push("/" + locale);
      }
    });
  }

  return (
    <>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>{" "}
        for a free trial.
      </p>
      <form
        action="/api/auth/callback/credentials"
        method="post"
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 300,
        }}
      >
        <label style={{ display: "flex" }}>
          <span style={{ display: "inline-block", flexGrow: 1, minWidth: 100 }}>
            {t("username")}
          </span>
          <input name="username" type="text" />
        </label>
        <label style={{ display: "flex" }}>
          <span style={{ display: "inline-block", flexGrow: 1, minWidth: 100 }}>
            {t("password")}
          </span>
          <input name="password" type="password" />
        </label>
        {error && <p>{t("error", { error })}</p>}
        <button type="submit">{t("submit")}</button>
      </form>
    </>
  );
}
