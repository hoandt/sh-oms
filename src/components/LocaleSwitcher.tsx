import { Link, usePathname } from "../navigation";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const otherLocale = locale === "en" ? "vi" : "en";
  const pathname = usePathname();

  return (
    <Link href={pathname} locale={otherLocale}>
      {t("switchLocale", { locale: otherLocale })}
    </Link>
  );
}
