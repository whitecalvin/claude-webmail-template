"use client";

import { useTranslations } from "next-intl";
import {
  Inbox,
  Star,
  Send,
  FileEdit,
  Trash2,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { FOLDERS } from "@/lib/mock-mails";
import { useMail } from "@/context/mail-context";
import { useTheme } from "@/context/theme-context";
import type { FolderId } from "@/types/mail";
import type { LayoutStyle } from "@/types/theme";

// Folder list + compose button shown on the left of the main mail view
// (inside AppShell). Visual style adapts to the active layout preset from
// the theme customizer (classic/card/minimal).
const FOLDER_ICONS: Record<FolderId, LucideIcon> = {
  inbox: Inbox,
  starred: Star,
  sent: Send,
  drafts: FileEdit,
  trash: Trash2,
};

const ASIDE_STYLE: Record<LayoutStyle, string> = {
  classic: "border-r border-(--border-app) bg-(--surface-app)",
  card: "bg-(--surface-muted)",
  minimal: "bg-(--surface-app)",
};

const COMPOSE_STYLE: Record<LayoutStyle, string> = {
  classic: "shadow-sm",
  card: "shadow-lg shadow-(--color-primary)/25",
  minimal: "shadow-none",
};

function navItemClass(style: LayoutStyle, isActive: boolean) {
  if (style === "card") {
    return isActive
      ? "bg-(--surface-app) shadow-md font-semibold text-(--color-primary)"
      : "text-(--text-muted) hover:bg-(--surface-app)/70";
  }
  if (style === "minimal") {
    return isActive
      ? "border-l-2 border-(--color-primary) font-semibold text-(--color-primary)"
      : "border-l-2 border-transparent text-(--text-muted) hover:text-(--text-app)";
  }
  return isActive
    ? "bg-(--color-primary)/10 font-semibold text-(--color-primary)"
    : "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5";
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("sidebar");
  const { activeFolder, setActiveFolder, unreadCounts, openCompose } =
    useMail();
  const { draft } = useTheme();
  const style = draft.layoutStyle;

  return (
    <aside
      className={`flex h-full w-full flex-col gap-4 p-3 ${ASIDE_STYLE[style]}`}
    >
      <button
        type="button"
        onClick={() => openCompose()}
        className={`flex items-center justify-center gap-2 rounded-(--radius-app) bg-(--color-primary) px-4 py-3 font-medium text-white transition hover:brightness-110 ${COMPOSE_STYLE[style]}`}
        style={{ paddingBlock: `calc(0.75rem * var(--density-scale))` }}
      >
        <Pencil size={18} />
        {t("compose")}
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {FOLDERS.map((folder) => {
          const Icon = FOLDER_ICONS[folder.id];
          const isActive = folder.id === activeFolder;
          const count = unreadCounts[folder.id];
          return (
            <button
              key={folder.id}
              type="button"
              onClick={() => {
                setActiveFolder(folder.id);
                onNavigate?.();
              }}
              className={`flex items-center gap-3 rounded-(--radius-app) px-3 text-sm transition ${navItemClass(
                style,
                isActive
              )}`}
              style={{ paddingBlock: `calc(0.6rem * var(--density-scale))` }}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{t(folder.id)}</span>
              {count > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-(--color-primary) text-white"
                      : "bg-(--color-accent)/15 text-(--color-accent)"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
