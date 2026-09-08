"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ModuleRail } from "@/components/layout/ModuleRail";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { SignatureSettingsView } from "@/components/settings/SignatureSettingsView";
import {
  ComingSoonView,
  IntegrationsCard,
  LabelsCard,
  LocaleCard,
  NotificationsCard,
} from "@/components/settings/SettingsDetailViews";
import { SettingsMobileView } from "@/components/settings/SettingsMobileView";
import { SETTINGS_NAV, type SettingsNavKey } from "@/lib/mock-settings";

// Settings hub: tabs that have real content render inline here via the
// `tab` query param; tabs that don't (filters, security, shortcuts,
// accessibility — see SETTINGS_NAV) route to their own standalone pages
// instead, but keep this same ModuleRail + SettingsNav shell.
function SettingsPageContent() {
  const searchParams = useSearchParams();
  // useSearchParams() requires a Suspense boundary — see the default export.
  const active = (searchParams.get("tab") as SettingsNavKey | null) ?? "signature";
  const activeLabel = SETTINGS_NAV.find((n) => n.key === active)?.name ?? "";

  return (
    <div className="flex h-dvh w-full flex-col bg-(--surface-app) lg:flex-row">
      <div className="hidden lg:block">
        <ModuleRail />
      </div>

      <div className="min-h-0 flex-1 lg:hidden">
        <SettingsMobileView />
      </div>
      <BottomTabBar />

      <div className="hidden lg:block">
        <SettingsNav active={active} />
      </div>

      <div className="hidden min-w-0 flex-1 lg:flex">
        {active === "signature" && <SignatureSettingsView />}

        {active === "labels" && (
          <div className="flex-1 overflow-y-auto p-7">
            <div className="mx-auto h-full max-w-lg">
              <LabelsCard />
            </div>
          </div>
        )}
        {active === "notifications" && (
          <div className="flex-1 overflow-y-auto p-7">
            <div className="mx-auto h-full max-w-lg">
              <NotificationsCard />
            </div>
          </div>
        )}
        {active === "integrations" && (
          <div className="flex-1 overflow-y-auto p-7">
            <div className="mx-auto h-full max-w-lg">
              <IntegrationsCard />
            </div>
          </div>
        )}
        {active === "locale" && (
          <div className="flex-1 overflow-y-auto p-7">
            <div className="mx-auto h-full max-w-lg">
              <LocaleCard />
            </div>
          </div>
        )}

        {active === "inbox-display" && <ComingSoonView label={activeLabel} />}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}
