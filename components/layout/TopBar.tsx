"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Menu, Search, Paintbrush, Bell, X, LogOut, ShieldCheck, Inbox, Paperclip, HelpCircle, UserCog } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useMail } from "@/context/mail-context";
import { CURRENT_USER } from "@/lib/current-user";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";
import { NOTIFICATIONS } from "@/lib/mock-notifications";
import type { LayoutStyle } from "@/types/theme";

// Top bar for the main mail view: search box, notification bell, theme
// customizer entry point, and the profile menu (with sign-out). Only one of
// the two dropdown menus can be open at a time via `openMenu`.
type OpenMenu = "none" | "notifications" | "profile";

const HEADER_STYLE: Record<LayoutStyle, string> = {
  classic: "border-b border-(--border-app)",
  card: "shadow-sm",
  minimal: "border-b border-(--border-app)",
};

const SEARCH_STYLE: Record<LayoutStyle, string> = {
  classic: "border border-(--border-app) bg-black/[.02] dark:bg-white/[.03]",
  card: "border-0 bg-(--surface-muted) shadow-inner",
  minimal: "border-0 border-b border-(--border-app) rounded-none bg-transparent",
};

export function TopBar({
  onMenuClick,
  onOpenTour,
  onToggleDelegate,
}: {
  onMenuClick?: () => void;
  onOpenTour?: () => void;
  onToggleDelegate?: () => void;
}) {
  const t = useTranslations("topBar");
  const tMenu = useTranslations("profileMenu");
  const router = useRouter();
  const { openCustomizer, draft } = useTheme();
  const { searchQuery, setSearchQuery } = useMail();
  const [openMenu, setOpenMenu] = useState<OpenMenu>("none");
  const style = draft.layoutStyle;

  const unreadNotifications = NOTIFICATIONS.filter((n) => n.unread);

  const closeMenus = () => setOpenMenu("none");

  return (
    <header
      className={`relative flex h-14 shrink-0 items-center gap-3 bg-(--surface-app) px-3 sm:px-4 ${HEADER_STYLE[style]}`}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-(--radius-app) p-2 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
        aria-label={t("openMenu")}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2 pr-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-(--radius-app) text-sm font-bold text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          G
        </span>
        <span className="hidden text-lg font-semibold sm:inline">GXWebMail</span>
      </div>

      <div className="relative flex-1 max-w-xl">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className={`w-full rounded-(--radius-app) py-2 pl-9 pr-8 text-sm outline-none transition focus:border-(--color-primary) ${SEARCH_STYLE[style]}`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={t("clearSearch")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {onOpenTour && (
          <button
            type="button"
            onClick={onOpenTour}
            className="hidden rounded-(--radius-app) p-2 hover:bg-black/5 dark:hover:bg-white/10 sm:flex"
            aria-label={t("tour")}
            title={t("tour")}
          >
            <HelpCircle size={18} />
          </button>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((v) => (v === "notifications" ? "none" : "notifications"))
            }
            className="relative rounded-(--radius-app) p-2 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={t("notifications")}
          >
            <Bell size={18} />
            {unreadNotifications.length > 0 && (
              <span
                className="absolute right-1 top-1 h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            )}
          </button>

          {openMenu === "notifications" && <NotificationPopover onClose={closeMenus} />}
        </div>

        <button
          type="button"
          onClick={openCustomizer}
          className="flex items-center gap-1.5 rounded-(--radius-app) border border-(--border-app) px-3 py-1.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Paintbrush size={16} style={{ color: "var(--color-accent)" }} />
          <span className="hidden sm:inline">{tMenu("themeCustomizer")}</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((v) => (v === "profile" ? "none" : "profile"))
            }
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--color-accent)" }}
            aria-label={tMenu("profile")}
          >
            {CURRENT_USER.name.slice(0, 1)}
          </button>

          {openMenu === "profile" && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenus} />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-(--radius-app) border border-(--border-app) bg-(--surface-app) shadow-xl">
                <div className="border-b border-(--border-app) px-4 py-3">
                  <p className="text-sm font-medium">{CURRENT_USER.name}</p>
                  <p className="truncate text-xs text-(--text-muted)">
                    {CURRENT_USER.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    openCustomizer();
                    closeMenus();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <Paintbrush size={16} style={{ color: "var(--color-accent)" }} />
                  {tMenu("themeCustomizer")}
                </button>
                <Link
                  href="/mailboxes"
                  onClick={closeMenus}
                  className="flex w-full items-center gap-2 border-t border-(--border-app) px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <Inbox size={16} className="text-(--text-muted)" />
                  {tMenu("mailboxes")}
                </Link>
                <Link
                  href="/files"
                  onClick={closeMenus}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <Paperclip size={16} className="text-(--text-muted)" />
                  {tMenu("files")}
                </Link>
                <Link
                  href="/admin"
                  onClick={closeMenus}
                  className="flex w-full items-center gap-2 border-t border-(--border-app) px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ShieldCheck size={16} className="text-(--text-muted)" />
                  {tMenu("admin")}
                </Link>
                {onToggleDelegate && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleDelegate();
                      closeMenus();
                    }}
                    className="flex w-full items-center gap-2 border-t border-(--border-app) px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <UserCog size={16} className="text-(--text-muted)" />
                    {tMenu("switchToDelegate")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    try {
                      window.localStorage.removeItem("gxmail:session");
                      window.sessionStorage.removeItem("gxmail:session-expires-at");
                    } catch {
                      // storage unavailable; navigate anyway
                    }
                    router.push("/login");
                  }}
                  className="flex w-full items-center gap-2 border-t border-(--border-app) px-4 py-2.5 text-left text-sm text-(--status-danger) hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <LogOut size={16} />
                  {tMenu("logout")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
