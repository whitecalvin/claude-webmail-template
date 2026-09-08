"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  Accessibility,
  ArrowLeft,
  Bell,
  ChevronRight,
  Cloud,
  Filter,
  Globe2,
  Keyboard,
  Mail,
  Shield,
  Tag,
  Zap,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/current-user";
import { SignatureSettingsView } from "./SignatureSettingsView";

// Mobile settings: a drill-down menu of sections. Most rows push a
// `MobileSettingsPage` rendered in-place (signature, labels, notifications,
// security, integrations, locale, storage); a few (filters, shortcuts,
// accessibility) instead route via `href` to their own dedicated pages,
// matching desktop's SETTINGS_NAV split.
import {
  ComingSoonView,
  IntegrationsCard,
  LabelsCard,
  LocaleCard,
  NotificationsCard,
} from "./SettingsDetailViews";
import { SecurityMobileView } from "./SecurityMobileView";

type MobileSettingsPage =
  | "root"
  | "signature"
  | "labels"
  | "notifications"
  | "security"
  | "integrations"
  | "locale"
  | "storage";

interface RootRow {
  id: string;
  page?: MobileSettingsPage;
  href?: string;
  icon: typeof Mail;
  name: string;
  desc: string;
  tag?: string;
  tagTone?: "warning";
}

const ROOT_ROWS: RootRow[] = [
  {
    id: "signature",
    page: "signature",
    icon: Mail,
    name: "계정 · 서명",
    desc: "서명 3개 · 자동응답 켜짐",
  },
  {
    id: "filters",
    href: "/rules",
    icon: Filter,
    name: "필터 · 자동 분류",
    desc: "규칙 6건 활성",
  },
  { id: "labels", page: "labels", icon: Tag, name: "라벨 관리", desc: "라벨 5개 · 1개 숨김" },
  {
    id: "notifications",
    page: "notifications",
    icon: Bell,
    name: "알림",
    desc: "중요만 즉시 · 방해 금지 22–07",
  },
  {
    id: "security",
    page: "security",
    icon: Shield,
    name: "계정 보안",
    desc: "2단계 인증 켜짐 · 기기 3대",
    tag: "!",
    tagTone: "warning",
  },
  {
    id: "integrations",
    page: "integrations",
    icon: Zap,
    name: "연동",
    desc: "3개 연결 · 2개 미연결",
  },
  {
    id: "locale",
    page: "locale",
    icon: Globe2,
    name: "언어 · 시간대",
    desc: "한국어 · (GMT+9) 서울",
  },
  {
    id: "shortcuts",
    href: "/shortcuts",
    icon: Keyboard,
    name: "단축키",
    desc: "인쇄용 전체 목록 보기",
  },
  {
    id: "accessibility",
    href: "/accessibility",
    icon: Accessibility,
    name: "접근성",
    desc: "KWCAG 2.2 · 통과 7 / 9",
  },
  {
    id: "storage",
    page: "storage",
    icon: Cloud,
    name: "저장 공간",
    desc: "정리하면 4.1 GB 확보 가능",
  },
];

const PAGE_TITLES: Record<Exclude<MobileSettingsPage, "root">, string> = {
  signature: "계정 · 서명",
  labels: "라벨 관리",
  notifications: "알림",
  security: "계정 보안",
  integrations: "연동",
  locale: "언어 · 시간대",
  storage: "저장 공간",
};

export function SettingsMobileView() {
  const [page, setPage] = useState<MobileSettingsPage>("root");

  if (page !== "root") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-(--border-app) px-4 py-3">
          <button
            type="button"
            onClick={() => setPage("root")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="설정으로"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-[15px] font-bold">{PAGE_TITLES[page]}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {page === "signature" && <SignatureSettingsView />}
          {page === "labels" && (
            <div className="p-4">
              <LabelsCard />
            </div>
          )}
          {page === "notifications" && (
            <div className="p-4">
              <NotificationsCard />
            </div>
          )}
          {page === "security" && <SecurityMobileView />}
          {page === "integrations" && (
            <div className="p-4">
              <IntegrationsCard />
            </div>
          )}
          {page === "locale" && (
            <div className="p-4">
              <LocaleCard />
            </div>
          )}
          {page === "storage" && <ComingSoonView label="저장 공간" />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-(--border-app) px-5 pb-3 pt-2">
        <p className="text-xl font-bold tracking-tight">설정</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-(--border-app) px-5 py-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: "#E4EAFE", color: "var(--color-primary)" }}
          >
            {CURRENT_USER.name.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{CURRENT_USER.name}</p>
            <p className="truncate text-xs text-(--text-muted)">
              사용량 18.2 / 50 GB
            </p>
          </div>
        </div>

        {ROOT_ROWS.map((row) => {
          const inner = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-black/[.04] text-(--text-muted) dark:bg-white/[.06]">
                <row.icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{row.name}</p>
                <p className="truncate text-xs text-(--text-muted)">{row.desc}</p>
              </div>
              {row.tag ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--status-warning-bg) text-[11px] font-bold text-(--status-warning)">
                  {row.tag}
                </span>
              ) : (
                <ChevronRight size={16} className="shrink-0 text-(--text-muted)" />
              )}
            </>
          );

          if (row.href) {
            return (
              <Link
                key={row.id}
                href={row.href}
                className="flex w-full items-center gap-3 border-b border-(--border-app) px-5 py-3.5 text-left"
              >
                {inner}
              </Link>
            );
          }

          return (
            <button
              key={row.id}
              type="button"
              onClick={() => row.page && setPage(row.page)}
              className="flex w-full items-center gap-3 border-b border-(--border-app) px-5 py-3.5 text-left"
            >
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
