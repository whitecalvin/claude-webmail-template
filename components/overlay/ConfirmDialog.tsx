"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Modal } from "./Modal";
import type { ConfirmTone } from "@/types/overlay";

// Shared confirmation dialog for anything from a plain "Are you sure?" to a
// destructive delete that requires typing a confirmation string first
// (`requireTypedText`, e.g. the account email) before the confirm button
// enables.
const ICON_STYLE: Record<Exclude<ConfirmTone, "default">, string> = {
  destructive: "bg-[#FBEAE8] text-[#C0433B]",
  warning: "bg-[#FDF0E4] text-[#B4740F]",
  alert: "bg-[#E9F3EC] text-[#2E8B5B]",
};

const CONFIRM_BTN_STYLE: Record<ConfirmTone, string> = {
  destructive: "bg-[#C0433B] text-white",
  warning: "bg-[#B4740F] text-white",
  default: "text-white",
  alert: "bg-[#17181B] text-white",
};

interface ConfirmDialogProps {
  tone: ConfirmTone;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  middleAction?: { label: string; onClick: () => void };
  requireTypedText?: string;
  typedPlaceholder?: string;
}

export function ConfirmDialog({
  tone,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  middleAction,
  requireTypedText,
  typedPlaceholder,
}: ConfirmDialogProps) {
  const t = useTranslations("common");
  const [typed, setTyped] = useState("");
  // Destructive actions and typed-confirmation flows can't be dismissed by
  // clicking outside — the user must explicitly confirm or cancel.
  const dismissible = tone !== "destructive" && !requireTypedText;
  const typedMatches = !requireTypedText || typed === requireTypedText;
  const isAlert = tone === "alert";
  const resolvedCancelLabel = cancelLabel ?? t("cancel");
  const defaultLabel =
    tone === "destructive" ? t("deleteForever") : tone === "warning" ? t("sendAnyway") : t("confirm");

  return (
    <Modal onClose={onCancel} dismissible={dismissible} maxWidth={requireTypedText ? 380 : 392}>
      <div className="flex flex-col gap-1 p-5">
        {tone !== "default" && (
          <div className="mb-1 flex items-start gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-base font-bold ${ICON_STYLE[tone]}`}
            >
              {tone === "alert" ? <Check size={17} strokeWidth={3} /> : "!"}
            </span>
            <div className="flex flex-col gap-1.5 pt-0.5">
              <h2 className="text-[16px] font-bold leading-snug text-foreground">{title}</h2>
              {description && (
                <p className="text-[13px] leading-relaxed text-(--text-muted) text-pretty">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        {tone === "default" && (
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[14.5px] font-bold leading-snug text-foreground">{title}</h2>
            {description && (
              <p className="text-[12.5px] leading-relaxed text-(--text-muted)">{description}</p>
            )}
          </div>
        )}

        {requireTypedText && (
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={typedPlaceholder ?? requireTypedText}
            autoFocus
            className="mt-2.5 h-9 w-full rounded-[9px] border border-(--border-app) bg-(--surface-muted) px-3 text-[12.5px] outline-none focus:border-(--color-primary)"
          />
        )}
      </div>

      <div className="flex items-center gap-2 px-5 pb-5">
        <div className={`flex gap-2 ${isAlert ? "w-full justify-end" : "ml-auto"}`}>
          {!isAlert && (
            <button
              type="button"
              onClick={onCancel}
              className="h-9.5 whitespace-nowrap rounded-[9px] border border-(--border-app) px-4 text-[13px] font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/10"
            >
              {resolvedCancelLabel}
            </button>
          )}
          {middleAction && (
            <button
              type="button"
              onClick={middleAction.onClick}
              className="h-9.5 whitespace-nowrap rounded-[9px] px-4 text-[13px] font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/10"
            >
              {middleAction.label}
            </button>
          )}
          <button
            type="button"
            disabled={requireTypedText ? !typedMatches : false}
            onClick={onConfirm}
            className={`h-9.5 whitespace-nowrap rounded-[9px] px-4 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:bg-[#F0D9D6] disabled:text-[#B0736D] ${
              requireTypedText && !typedMatches ? "" : CONFIRM_BTN_STYLE[tone]
            }`}
            style={
              requireTypedText && !typedMatches
                ? undefined
                : tone === "default"
                  ? { backgroundColor: "var(--color-primary)" }
                  : undefined
            }
          >
            {confirmLabel ?? defaultLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
