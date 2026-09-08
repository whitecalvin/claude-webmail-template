"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarDays,
  CheckCircle2,
  Cloud,
  Hexagon,
  MessageSquare,
  Users,
} from "lucide-react";
import {
  INTEGRATIONS,
  LABEL_ROWS,
  NOTIF_PREFS,
} from "@/lib/mock-settings";
import { useToast } from "@/context/toast-context";
import { Modal } from "@/components/overlay/Modal";
import { Dropdown } from "@/components/ui/Dropdown";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, locales, type Locale } from "@/i18n/routing";

// Card components for the four settings tabs that live inline on
// /settings?tab=... (labels, notifications, integrations, locale), plus a
// generic "not built yet" placeholder for tabs without real content.

const VISIBILITY_STYLE: Record<string, string> = {
  "목록 표시": "bg-(--status-success-bg) text-(--status-success)",
  숨김: "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
  "DLP 연동": "bg-(--status-danger-bg) text-(--status-danger)",
};

const MODE_STYLE: Record<string, string> = {
  "즉시 알림": "bg-(--status-success-bg) text-(--status-success)",
  "1시간 요약": "bg-(--status-warning-bg) text-(--status-warning)",
  "알림 없음": "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]",
};

const INTEGRATION_ICONS: Record<string, typeof CalendarDays> = {
  "사내 캘린더": CalendarDays,
  "결재 시스템 (그로우)": CheckCircle2,
  "HR 조직도": Users,
  Slack: MessageSquare,
  "Google Drive": Cloud,
};

function CardShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-[14px] border border-(--border-app) bg-(--surface-app) p-[18px]">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[13.5px] font-bold">{title}</h2>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">{children}</div>
    </div>
  );
}

const LABEL_COLOR_OPTIONS = ["#2b4bf2", "#2e8b5b", "#e0ac4a", "#6b5ca8", "#c0433b"];

export function LabelsCard() {
  const toast = useToast();
  const [labels, setLabels] = useState(LABEL_ROWS);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(LABEL_COLOR_OPTIONS[0]);

  const createLabel = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLabels((prev) => [{ name: trimmed, color, count: 0, visibility: "목록 표시" }, ...prev]);
    setName("");
    setColor(LABEL_COLOR_OPTIONS[0]);
    setCreating(false);
    toast.success("라벨을 만들었습니다", { sub: trimmed });
  };

  return (
    <CardShell
      title="라벨 관리"
      action={
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="text-[11.5px] font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          라벨 만들기
        </button>
      }
    >
      {labels.map((label) => (
        <div key={label.name} className="flex items-center gap-2.5">
          <span
            className="h-[9px] w-[9px] shrink-0 rounded-[3px]"
            style={{ backgroundColor: label.color }}
          />
          <span className="min-w-0 flex-1 truncate text-xs font-semibold">
            {label.name}
          </span>
          <span className="shrink-0 text-[11px] text-(--text-muted)">
            {label.count}통
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${VISIBILITY_STYLE[label.visibility]}`}
          >
            {label.visibility}
          </span>
        </div>
      ))}

      {creating && (
        <Modal onClose={() => setCreating(false)} maxWidth={360}>
          <div className="flex items-center gap-2.5 border-b border-(--border-app) px-4 py-3.5">
            <p className="flex-1 text-sm font-bold">라벨 만들기</p>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="flex h-[26px] w-[26px] items-center justify-center rounded-lg text-[13px] text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-3 px-4 py-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-(--text-muted)">라벨 이름</span>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createLabel();
                }}
                placeholder="예: 프로젝트 아틀라스"
                className="h-9 rounded-[9px] border border-(--border-app) px-3 text-[13px] outline-none focus:border-(--color-primary)"
              />
            </label>
            <div className="flex gap-2">
              {LABEL_COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-6 w-6 rounded-full"
                  style={{
                    backgroundColor: c,
                    boxShadow: color === c ? "0 0 0 2px #fff, 0 0 0 4px " + c : undefined,
                  }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-(--border-app) bg-(--surface-muted) px-4 py-3">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="h-[34px] rounded-[9px] border border-(--border-app) px-3.5 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              취소
            </button>
            <button
              type="button"
              onClick={createLabel}
              disabled={!name.trim()}
              className="h-[34px] rounded-[9px] px-3.5 text-xs font-semibold text-white transition disabled:opacity-40"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              만들기
            </button>
          </div>
        </Modal>
      )}
    </CardShell>
  );
}

export function NotificationsCard() {
  return (
    <CardShell title="알림">
      {NOTIF_PREFS.map((pref) => (
        <div key={pref.name} className="flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{pref.name}</p>
            <p className="truncate text-[11px] text-(--text-muted)">{pref.desc}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${MODE_STYLE[pref.mode]}`}
          >
            {pref.mode}
          </span>
        </div>
      ))}
      <div className="mt-1 rounded-[9px] bg-(--color-primary)/[.08] px-3 py-2 text-[11px] text-(--text-muted)">
        방해 금지 22:00–07:00 · 주말 제외 (긴급 결재 예외)
      </div>
    </CardShell>
  );
}

export function IntegrationsCard() {
  const [items, setItems] = useState(INTEGRATIONS);

  const handleAction = (name: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.name === name
          ? it.state === "연결됨"
            ? { ...it, state: "미연결", action: "연결" }
            : it.action === "연결"
              ? { ...it, state: "연결됨", action: "해제" }
              : it
          : it
      )
    );
  };

  return (
    <CardShell title="연동">
      {items.map((it) => {
        const Icon = INTEGRATION_ICONS[it.name] ?? Hexagon;
        return (
          <div key={it.name} className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-white"
              style={{ backgroundColor: it.state === "연결됨" ? it.color : "var(--text-muted)" }}
            >
              <Icon size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{it.name}</p>
              <p className="truncate text-[11px] text-(--text-muted)">{it.scope}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                it.state === "연결됨"
                  ? "bg-(--status-success-bg) text-(--status-success)"
                  : "bg-black/[.06] text-(--text-muted) dark:bg-white/[.08]"
              }`}
            >
              {it.state}
            </span>
            <button
              type="button"
              onClick={() => handleAction(it.name)}
              className="shrink-0 text-[11px] font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {it.action}
            </button>
          </div>
        );
      })}
    </CardShell>
  );
}

export function LocaleCard() {
  const locale = useLocale() as Locale;
  const t = useTranslations("localeSettings");
  const pathname = usePathname();
  const router = useRouter();

  const changeLocale = (nextLocale: string) => {
    if (!locales.includes(nextLocale as Locale)) return;
    const query = window.location.search;
    router.replace(`${pathname}${query}`, { locale: nextLocale as Locale });
  };

  return (
    <CardShell title={t("title")}>
      <div className="grid gap-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-(--text-muted)">
            {t("displayLanguage")}
          </span>
          <Dropdown
            value={locale}
            options={locales.map((value) => ({ value, label: localeNames[value] }))}
            onChange={changeLocale}
            variant="form"
          />
        </div>
      </div>
      <div className="mt-auto rounded-[11px] border border-(--border-app) bg-black/[.015] p-3 dark:bg-white/[.02]">
        <p className="text-[10.5px] font-bold uppercase tracking-[.06em] text-(--text-muted)">
          {t("preview")}
        </p>
        <p className="mt-1 text-xs font-semibold">
          {new Date().toLocaleString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
          })}{" "}
          · KST
        </p>
        <p className="mt-1 text-[11px] text-(--text-muted)">
          {t("recipientTimezoneHint")}
        </p>
      </div>
    </CardShell>
  );
}

export function SettingsDetailGrid() {
  return (
    <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-4 overflow-y-auto p-7">
      <LabelsCard />
      <NotificationsCard />
      <IntegrationsCard />
      <LocaleCard />
    </div>
  );
}

export function ComingSoonView({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-7 text-center">
      <p className="text-sm font-semibold text-(--text-app)">{label}</p>
      <p className="text-xs text-(--text-muted)">
        이 설정 화면은 아직 준비 중입니다.
      </p>
    </div>
  );
}
