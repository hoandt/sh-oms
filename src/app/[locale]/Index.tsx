"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  session: Session | null;
};

export default function Index({ session }: Props) {
  const t = useTranslations("Index");
  const locale = useLocale();
  function onLogoutClick() {
    signOut();
  }

  return (
    <div title={t("title")}>
      {session ? (
        <>
          <p>{t("loggedIn", { username: session.user?.name })}</p>
          <p>
            <Link href={locale + "/dashboard"}>{t("secret")}</Link>
          </p>
          <button onClick={onLogoutClick} type="button">
            {t("logout")}
          </button>
        </>
      ) : (
        <>
          <p>{t("loggedOut")}</p>
          <Link href={locale + "/login"}>{t("login")}</Link>
        </>
      )}
    </div>
  );
}
