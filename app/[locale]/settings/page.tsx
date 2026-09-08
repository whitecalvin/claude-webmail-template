import { redirect } from "next/navigation";
import { SETTINGS_NAV, type SettingsNavKey } from "@/lib/mock-settings";

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab } = await searchParams;
  const section = SETTINGS_NAV.some((item) => item.key === tab)
    ? (tab as SettingsNavKey)
    : "signature";
  redirect(`/${locale}/settings/${section}`);
}
