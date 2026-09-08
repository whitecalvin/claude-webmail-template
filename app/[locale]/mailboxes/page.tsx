"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import {
  DELEGATE_NOTE,
  MAIL_TEMPLATES,
  SCHEDULED_MAILS,
  SHARED_BOXES,
} from "@/lib/mock-mailboxes";
import { LoadingModal } from "@/components/overlay/LoadingModal";
import { useToast } from "@/context/toast-context";
import { useUiText } from "@/components/i18n/useUiText";

// "공용 메일함 · 예약 발송 · 템플릿" page: shared/delegated mailboxes,
// the scheduled-send queue (with a simulated "send now" progress modal),
// and mail templates.
const STATE_TONE: Record<string, string> = {
  warning: "bg-(--status-warning-bg) text-(--status-warning)",
  info: "bg-(--color-primary)/10 text-(--color-primary)",
  success: "bg-(--status-success-bg) text-(--status-success)",
};

export default function MailboxesPage() {
  const toast = useToast();
  const t = useTranslations("mailboxesPage");
  const ui = useUiText();
  const [mails, setMails] = useState(SCHEDULED_MAILS);
  const [sendingPct, setSendingPct] = useState<number | null>(null);

  useEffect(() => {
    if (sendingPct === null) return;
    if (sendingPct >= 100) {
      const timer = setTimeout(() => {
        setSendingPct(null);
        setMails((prev) => prev.filter((_, i) => i !== 0));
        toast.success(t("sentNow"), { sub: ui(SCHEDULED_MAILS[0]?.subject ?? "") });
      }, 250);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setSendingPct((p) => Math.min((p ?? 0) + 20, 100)), 180);
    return () => clearTimeout(timer);
  }, [sendingPct, t, toast, ui]);

  return (
    <WorkspaceLayout
      title={t("title")}
      headerActions={
        <>
            <button
              type="button"
              onClick={() => toast.info(t("permissionSent"))}
              className="h-9 rounded-lg border border-(--border-app) px-3.5 text-xs font-semibold"
            >
              {t("permissionRequest")}
            </button>
            <button
              type="button"
              onClick={() => toast.info(t("templateEditorPending"))}
              className="h-9 rounded-lg px-3.5 text-xs font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {t("newTemplate")}
            </button>
        </>
      }
      className="overflow-y-auto bg-(--surface-muted)"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 sm:p-8">
        <p className="text-xs text-(--text-muted)">
          {t("summary", { mailboxes: SHARED_BOXES.length, scheduled: mails.length, templates: MAIL_TEMPLATES.length })}
        </p>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="rounded-xl border border-(--border-app) bg-background p-5">
            <h2 className="mb-3 text-sm font-bold">{t("sharedMailboxes")}</h2>
            <div className="flex flex-col gap-2">
              {SHARED_BOXES.map((b) => (
                <div key={b.addr} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E4EAFE] text-[10px] font-bold text-(--color-primary)">
                    {ui(b.initials)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{ui(b.name)}</p>
                    <p className="truncate text-[10.5px] text-(--text-muted)">{b.addr}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-(--text-muted) dark:bg-white/10">
                    {ui(b.role)}
                  </span>
                  {b.unread > 0 && (
                    <span
                      className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {b.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-(--color-primary)/6 px-3 py-2 text-[11px] text-(--text-muted)">
              {t("delegatedFormat", { delegate: ui(DELEGATE_NOTE) })}
            </p>
          </div>

          <div className="rounded-xl border border-(--border-app) bg-background p-5">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-bold">{t("scheduledMailbox")}</h2>
              <span className="ml-auto text-[11px] text-(--text-muted)">{t("waitingCount", { count: mails.length })}</span>
            </div>
            {mails.length === 0 ? (
              <p className="py-4 text-center text-xs text-(--text-muted)">{t("noScheduledMail")}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {mails.map((m) => (
                  <div key={m.subject} className="border-b border-(--border-app) pb-2.5 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-(--text-muted)">{ui(m.when)}</span>
                      <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${STATE_TONE[m.tone]}`}>
                        {ui(m.state)}
                      </span>
                    </div>
                    <p className="truncate text-xs font-semibold">{ui(m.subject)}</p>
                    <p className="truncate text-[10.5px] text-(--text-muted)">{ui(m.to)}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={mails.length === 0}
                onClick={() => setSendingPct(0)}
                className="h-8 flex-1 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                style={{ backgroundColor: "#17181B" }}
              >
                {t("sendNow")}
              </button>
              <button
                type="button"
                onClick={() => toast.info(t("scheduleChangePending"))}
                className="h-8 flex-1 rounded-lg border border-(--border-app) text-xs font-semibold"
              >
                {t("changeSchedule")}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-(--border-app) bg-background p-5">
            <h2 className="mb-3 text-sm font-bold">{t("templatesAndSnippets")}</h2>
            <div className="flex flex-col gap-2.5">
              {MAIL_TEMPLATES.map((template) => (
                <div key={template.name} className="border-b border-(--border-app) pb-2.5 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold">{ui(template.name)}</p>
                    <span className="ml-auto shrink-0 rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold text-(--text-muted) dark:bg-white/10">
                      {ui(template.scope)}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-(--text-muted)">
                    {t("usage", { count: template.uses, date: ui(template.edited) })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {sendingPct !== null && (
        <LoadingModal title={t("sending")} sub={t("keepWindowOpen")} pct={sendingPct} />
      )}
    </WorkspaceLayout>
  );
}
