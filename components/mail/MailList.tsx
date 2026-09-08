"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Star, Trash2 } from "lucide-react";
import { useMail } from "@/context/mail-context";
import { useTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { formatMailTimestamp } from "@/lib/format-date";
import { FOLDERS } from "@/lib/mock-mails";
import { ConfirmDialog } from "@/components/overlay/ConfirmDialog";
import { ActionSheet } from "@/components/overlay/ActionSheet";
import { BottomSheet, BottomSheetRow } from "@/components/overlay/BottomSheet";
import type { Email, FolderId } from "@/types/mail";
import type { LayoutStyle } from "@/types/theme";

// The inbox list pane (left of ReadingPane in AppShell). Row layout and
// hover styles vary by the active layout preset (classic/card/minimal) from
// the theme customizer.
const FOLDER_DOT: Record<FolderId, string> = {
  inbox: "#2B4BF2",
  starred: "#B4740F",
  sent: "#2E8B5B",
  drafts: "#9A9EA5",
  trash: "#C0433B",
};

const CONTAINER_STYLE: Record<LayoutStyle, string> = {
  classic: "border-r border-(--border-app) bg-background",
  card: "bg-(--surface-muted)",
  minimal: "border-r border-(--border-app) bg-background",
};

const HEADER_STYLE: Record<LayoutStyle, string> = {
  classic: "border-b border-(--border-app)",
  card: "",
  minimal: "border-b border-(--border-app)",
};

const LIST_STYLE: Record<LayoutStyle, string> = {
  classic: "",
  card: "flex flex-col gap-2 p-3",
  minimal: "",
};

function itemClass(style: LayoutStyle, isActive: boolean) {
  if (style === "card") {
    return `rounded-(--radius-app) bg-background shadow-sm transition hover:shadow-md ${
      isActive ? "ring-2 ring-(--color-primary)" : ""
    }`;
  }
  if (style === "minimal") {
    return `border-b border-transparent transition ${
      isActive
        ? "border-l-2 border-l-(--color-primary) bg-black/2 dark:bg-white/3"
        : "border-l-2 border-l-transparent hover:bg-black/2 dark:hover:bg-white/3"
    }`;
  }
  return `border-b border-(--border-app) transition ${
    isActive
      ? "bg-(--color-primary)/10"
      : "hover:bg-black/3 dark:hover:bg-white/5"
  }`;
}

export function MailList() {
  const t = useTranslations("mailList");
  const tFolder = useTranslations("sidebar");
  const {
    visibleEmails,
    selectedEmailId,
    selectEmail,
    toggleStar,
    moveToTrash,
    moveToFolder,
    permanentlyDelete,
    activeFolder,
  } = useMail();
  const { draft } = useTheme();
  const toast = useToast();
  const [pendingPermDelete, setPendingPermDelete] = useState<Email | null>(null);
  const [actionSheetEmail, setActionSheetEmail] = useState<Email | null>(null);
  const [moveSheetEmail, setMoveSheetEmail] = useState<Email | null>(null);
  const style = draft.layoutStyle;

  const activeFolderEntry = FOLDERS.find((f) => f.id === activeFolder);
  const folderLabel = activeFolderEntry ? tFolder(activeFolderEntry.id) : null;

  // Trashing an already-trashed email means permanent delete (with a
  // confirm dialog); trashing anything else is reversible via an undo toast.
  const handleTrashClick = (email: Email) => {
    if (email.folder === "trash") {
      setPendingPermDelete(email);
      return;
    }
    const previousFolder = email.folder;
    moveToTrash(email.id);
    toast.undo(t("movedToTrash"), () => moveToFolder(email.id, previousFolder));
  };

  return (
    <div
      className={`flex h-full w-full flex-col ${CONTAINER_STYLE[style]}`}
    >
      <div
        className={`shrink-0 px-4 py-3 text-sm font-semibold ${HEADER_STYLE[style]}`}
        style={{ paddingBlock: `calc(0.75rem * var(--density-scale))` }}
      >
        {folderLabel}
        <span className="ml-2 font-normal text-(--text-muted)">
          {t("countUnit", { count: visibleEmails.length })}
        </span>
      </div>

      <ul className={`flex-1 overflow-y-auto ${LIST_STYLE[style]}`}>
        {visibleEmails.length === 0 && (
          <li className="p-6 text-center text-sm text-(--text-muted)">
            {t("noMail")}
          </li>
        )}
        {visibleEmails.map((email) => {
          const isActive = email.id === selectedEmailId;
          return (
            <li key={email.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => selectEmail(email.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectEmail(email.id);
                  }
                }}
                className={`group flex w-full cursor-pointer items-start gap-3 px-4 text-left ${itemClass(
                  style,
                  isActive
                )}`}
                style={{ paddingBlock: `calc(0.85rem * var(--density-scale))` }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(email.id);
                  }}
                  className="mt-0.5 shrink-0 text-(--text-muted) hover:text-(--color-accent)"
                  aria-label={t("markImportant")}
                >
                  <Star
                    size={16}
                    fill={email.starred ? "var(--color-accent)" : "none"}
                    color={
                      email.starred ? "var(--color-accent)" : "currentColor"
                    }
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-sm ${
                        email.unread ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {email.from.name}
                    </span>
                    <span className="shrink-0 text-xs text-(--text-muted)">
                      {formatMailTimestamp(email.receivedAt)}
                    </span>
                  </div>
                  <p
                    className={`truncate text-sm ${
                      email.unread ? "font-medium" : "text-(--text-muted)"
                    }`}
                  >
                    {email.subject}
                  </p>
                  <p className="truncate text-xs text-(--text-muted)">
                    {email.preview}
                  </p>
                </div>

                {email.unread && (
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                )}

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrashClick(email);
                    }}
                    className="hidden shrink-0 rounded p-1 text-(--text-muted) opacity-0 transition hover:bg-black/5 hover:text-[#C0433B] group-hover:opacity-100 dark:hover:bg-white/10 lg:flex"
                    aria-label={email.folder === "trash" ? t("permanentDelete") : t("delete")}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionSheetEmail(email);
                    }}
                    className="flex shrink-0 rounded p-1 text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
                    aria-label={t("more")}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {actionSheetEmail && (
        <ActionSheet
          context={actionSheetEmail.subject}
          onClose={() => setActionSheetEmail(null)}
          items={
            actionSheetEmail.folder === "trash"
              ? [
                  {
                    label: t("restoreToInbox"),
                    onClick: () => {
                      moveToFolder(actionSheetEmail.id, "inbox");
                      toast.success(t("restoredToInbox"));
                    },
                  },
                  {
                    label: t("permanentDelete"),
                    destructive: true,
                    onClick: () => setPendingPermDelete(actionSheetEmail),
                  },
                ]
              : [
                  { label: t("moveToFolder"), onClick: () => setMoveSheetEmail(actionSheetEmail) },
                  { label: t("delete"), destructive: true, onClick: () => handleTrashClick(actionSheetEmail) },
                ]
          }
        />
      )}

      {moveSheetEmail && (
        <BottomSheet title={t("moveMailTitle")} onClose={() => setMoveSheetEmail(null)}>
          {FOLDERS.filter((f) => f.id !== "starred" && f.id !== moveSheetEmail.folder).map((f) => (
            <BottomSheetRow
              key={f.id}
              label={tFolder(f.id)}
              dot={FOLDER_DOT[f.id]}
              onClick={() => {
                moveToFolder(moveSheetEmail.id, f.id);
                toast.success(t("movedTo", { folder: tFolder(f.id) }));
                setMoveSheetEmail(null);
              }}
            />
          ))}
        </BottomSheet>
      )}

      {pendingPermDelete && (
        <ConfirmDialog
          tone="destructive"
          title={t("confirmPermDeleteTitle")}
          description={t("confirmPermDeleteDesc")}
          confirmLabel={t("permanentDelete")}
          onCancel={() => setPendingPermDelete(null)}
          onConfirm={() => {
            permanentlyDelete(pendingPermDelete.id);
            setPendingPermDelete(null);
            toast.success(t("permanentlyDeleted"));
          }}
        />
      )}
    </div>
  );
}
