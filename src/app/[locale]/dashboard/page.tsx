"use client";

import PageLayout from "@/components/PageLayout";
import { useTranslations } from "next-intl";

export default function Secret() {
  const t = useTranslations("Secret");

  return (
    <PageLayout title={t("title")}>
      <p className="text-3xl font-bold underline">{t("description")}</p>
    </PageLayout>
  );
}
