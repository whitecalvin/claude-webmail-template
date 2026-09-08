"use client";

import type { ComponentType } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { SettingsHeaderTitle } from "@/components/settings/SettingsHeaderTitle";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { SignatureSettingsView } from "@/components/settings/SignatureSettingsView";
import { ComingSoonView, IntegrationsCard, LabelsCard, LocaleCard, NotificationsCard } from "@/components/settings/SettingsDetailViews";
import { SETTINGS_NAV, type SettingsNavKey } from "@/lib/mock-settings";

const CARD_SECTIONS: Partial<Record<SettingsNavKey, ComponentType>> = {
  labels: LabelsCard,
  notifications: NotificationsCard,
  integrations: IntegrationsCard,
  locale: LocaleCard,
};

export function SettingsSectionPage({ active }: { active: SettingsNavKey }) {
  const title = SETTINGS_NAV.find((item) => item.key === active)?.name ?? "설정";
  const Card = CARD_SECTIONS[active];

  return (
    <WorkspaceLayout title={<SettingsHeaderTitle title={title} />} showGlobalSearch={false} className="flex flex-col bg-(--surface-app) lg:flex-row">
      <SettingsNav active={active} />
      {active === "signature" ? (
        <SignatureSettingsView />
      ) : active === "inbox-display" ? (
        <ComingSoonView label={title} />
      ) : (
        <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-7">
          <div className="mx-auto h-full max-w-lg">{Card ? <Card /> : null}</div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
