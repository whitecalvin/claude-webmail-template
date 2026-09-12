import { SettingsLanding } from "@/components/settings/SettingsLanding";
import { redirect } from "next/navigation";
import { SETTINGS_NAV, type SettingsNavKey } from "@/lib/mock-settings";

export default async function SettingsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
  const [{ locale }, { tab }] = await Promise.all([params, searchParams]);
  if (tab && SETTINGS_NAV.some((item) => item.key === tab)) redirect(`/${locale}/settings/${tab as SettingsNavKey}`);
  return <SettingsLanding />;
}
