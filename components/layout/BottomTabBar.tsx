"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Mail, CalendarDays, Users, Settings } from "lucide-react";

// Mobile-only (`lg:hidden`) bottom navigation — the small-screen counterpart
// of ModuleRail, but limited to the four most-used sections.
const TABS = [
  { href: "/", icon: Mail, labelKey: "mail" },
  { href: "/calendar", icon: CalendarDays, labelKey: "calendar" },
  { href: "/contacts", icon: Users, labelKey: "contacts" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
] as const;

export function BottomTabBar() {
  const t = useTranslations("bottomTabBar");
  const pathname = usePathname();

  return (
    <nav
      className="flex h-[64px] shrink-0 items-center border-t border-(--border-app) bg-(--surface-app) pb-[max(0px,env(safe-area-inset-bottom))] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.4 : 2}
              color={isActive ? "var(--color-primary)" : "var(--text-muted)"}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: isActive ? "var(--color-primary)" : "var(--text-muted)" }}
            >
              {t(tab.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
