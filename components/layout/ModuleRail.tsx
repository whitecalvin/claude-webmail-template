"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Mail,
  CalendarDays,
  Users,
  ClipboardCheck,
  ShieldAlert,
  Search,
  Settings,
  Inbox,
  Paperclip,
  ShieldCheck,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/current-user";

// Global left-hand icon rail for switching between top-level app sections.
// Rendered on nearly every page (mail, calendar, contacts, admin, etc.),
// each of which lays it out as the first column in a flex row.
interface ModuleItem {
  href: string;
  icon: LucideIcon;
  labelKey: "mail" | "calendar" | "contacts" | "approvals" | "quarantine" | "search" | "settings";
  enabled: boolean;
}

const MODULES: ModuleItem[] = [
  { href: "/", icon: Mail, labelKey: "mail", enabled: true },
  { href: "/calendar", icon: CalendarDays, labelKey: "calendar", enabled: true },
  { href: "/contacts", icon: Users, labelKey: "contacts", enabled: true },
  { href: "/approvals", icon: ClipboardCheck, labelKey: "approvals", enabled: true },
  { href: "/quarantine", icon: ShieldAlert, labelKey: "quarantine", enabled: true },
  { href: "/search", icon: Search, labelKey: "search", enabled: true },
  { href: "/settings", icon: Settings, labelKey: "settings", enabled: true },
];

export function ModuleRail() {
  const t = useTranslations("nav");
  const tMenu = useTranslations("profileMenu");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="flex h-full w-[76px] shrink-0 flex-col items-center gap-1 py-3.5"
      style={{ backgroundColor: "var(--rail-bg)" }}
    >
      {MODULES.map((mod) => {
        const Icon = mod.icon;
        const isActive =
          mod.enabled &&
          (mod.href === "/" ? pathname === "/" : pathname.startsWith(mod.href));
        const label = t(mod.labelKey);
        const content = (
          <div
            className={`flex w-14 flex-col items-center gap-1 rounded-[10px] py-2.5 text-[9px] font-semibold transition ${
              isActive
                ? "text-white"
                : mod.enabled
                  ? "text-white/60 hover:bg-white/[.08] hover:text-white/85"
                  : "cursor-not-allowed text-white/25"
            }`}
            style={isActive ? { backgroundColor: "rgba(255,255,255,.12)" } : undefined}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </div>
        );

        if (!mod.enabled) {
          return (
            <div key={mod.labelKey} title="준비 중입니다">
              {content}
            </div>
          );
        }

        return (
          <Link key={mod.labelKey} href={mod.href}>
            {content}
          </Link>
        );
      })}

      <div className="relative mt-auto">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          aria-label="프로필 메뉴"
        >
          {CURRENT_USER.name.slice(0, 1)}
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute bottom-0 left-full z-50 ml-2 w-56 overflow-hidden rounded-[var(--radius-app)] border border-[var(--border-app)] bg-[var(--surface-app)] shadow-xl">
              <div className="border-b border-[var(--border-app)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--text-app)]">{CURRENT_USER.name}</p>
                <p className="truncate text-xs text-[var(--text-muted)]">{CURRENT_USER.email}</p>
              </div>
              <Link
                href="/mailboxes"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[var(--text-app)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Inbox size={16} className="text-[var(--text-muted)]" />
                {tMenu("mailboxes")}
              </Link>
              <Link
                href="/files"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[var(--text-app)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Paperclip size={16} className="text-[var(--text-muted)]" />
                {tMenu("files")}
              </Link>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 border-t border-[var(--border-app)] px-4 py-2.5 text-left text-sm text-[var(--text-app)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <ShieldCheck size={16} className="text-[var(--text-muted)]" />
                {tMenu("admin")}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  try {
                    window.localStorage.removeItem("gxmail:session");
                    window.sessionStorage.removeItem("gxmail:session-expires-at");
                  } catch {
                    // storage unavailable; navigate anyway
                  }
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2 border-t border-[var(--border-app)] px-4 py-2.5 text-left text-sm text-[var(--status-danger)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <LogOut size={16} />
                {tMenu("logout")}
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
