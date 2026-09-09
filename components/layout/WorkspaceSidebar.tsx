"use client";

import { useTranslations } from "next-intl";
import {
  Archive,
  CalendarDays,
  ChevronLeft,
  ClipboardCheck,
  FileEdit,
  Files,
  Inbox,
  LogOut,
  MailPlus,
  Paperclip,
  Search,
  Send,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Star,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useMail } from "@/context/mail-context";
import { useTheme } from "@/context/theme-context";
import { FOLDERS } from "@/lib/mock-mails";
import type { FolderId } from "@/types/mail";
import type { LayoutStyle } from "@/types/theme";

const FOLDER_ICONS: Record<FolderId, LucideIcon> = {
  inbox: Inbox,
  starred: Star,
  drafts: FileEdit,
  sent: Send,
  archive: Archive,
  spam: ShieldAlert,
  trash: Trash2,
};

const STORAGE_USAGE: Record<FolderId, string> = {
  inbox: "0 MiB / 10 GiB",
  starred: "0 MiB / 10 GiB",
  drafts: "0 MiB / 10 GiB",
  sent: "1.3 MiB / 10 GiB",
  archive: "624 MiB / 10 GiB",
  spam: "0 MiB / 10 GiB",
  trash: "0 MiB / 10 GiB",
};

const TOOLS = [
  { href: "/calendar", icon: CalendarDays, key: "calendar" },
  { href: "/contacts", icon: Users, key: "contacts" },
  { href: "/approvals", icon: ClipboardCheck, key: "approvals" },
  { href: "/rules", icon: SlidersHorizontal, key: "rules" },
  { href: "/files", icon: Paperclip, key: "files" },
  { href: "/quarantine", icon: ShieldAlert, key: "quarantine" },
  { href: "/search", icon: Search, key: "search" },
  { href: "/settings", icon: Settings, key: "settings" },
] as const;

const NAV_STYLE: Record<LayoutStyle, { active: string; idle: string }> = {
  classic: {
    active: "bg-(--color-primary)/10 font-semibold text-(--color-primary)",
    idle: "text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5",
  },
  card: {
    active: "bg-background font-semibold text-(--color-primary) shadow-sm",
    idle: "text-(--text-muted) hover:bg-background/70",
  },
  minimal: {
    active: "bg-black/3 font-semibold text-(--color-primary) dark:bg-white/5",
    idle: "text-(--text-muted) hover:text-foreground",
  },
};

export interface WorkspaceSidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  onClose?: () => void;
  onToggleCollapsed?: () => void;
}

function isToolActive(pathname: string, href: string) {
  if (href === "/settings") {
    return ["/settings", "/security", "/accessibility", "/shortcuts"].some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceSidebar({ collapsed = false, mobile = false, onClose, onToggleCollapsed }: WorkspaceSidebarProps) {
  const tFolder = useTranslations("sidebar");
  const tSidebar = useTranslations("workspaceSidebar");
  const tProfile = useTranslations("profileMenu");
  const pathname = usePathname();
  const router = useRouter();
  const { activeFolder, setActiveFolder, unreadCounts, openCompose } = useMail();
  const { draft } = useTheme();
  const compact = collapsed && !mobile;
  const navStyle = NAV_STYLE[draft.layoutStyle];
  const sidebarOnRight = draft.sidebarPosition === "right" && !mobile;

  const openFolder = (folder: FolderId) => {
    setActiveFolder(folder);
    if (pathname !== "/") router.push("/");
    onClose?.();
  };

  const logout = () => {
    try {
      window.localStorage.removeItem("gxmail:session");
      window.sessionStorage.removeItem("gxmail:session-expires-at");
    } catch {
      // Storage can be unavailable; navigation should still continue.
    }
    onClose?.();
    router.push("/login");
  };

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col bg-background transition-[width] duration-200 ${
        mobile ? "w-62.5 max-w-[calc(100vw-2rem)] shadow-2xl" : compact ? "w-18" : "w-62.5"
      }`}
    >
      <div className="relative flex h-14 shrink-0 items-center px-3">
        <Link href="/" onClick={onClose} className={`flex min-w-0 items-center ${compact ? "justify-center" : "gap-3"}`} aria-label="GXWebMail">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-app) bg-(--color-primary) font-bold text-white">G</span>
          {!compact ? <span className="truncate text-lg font-semibold">GXWebMail</span> : null}
        </Link>
        {mobile ? (
          <button type="button" onClick={onClose} autoFocus className="ml-auto rounded-(--radius-app) p-2 text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/5" aria-label={tSidebar("closeMenu")}>
            <X size={20} />
          </button>
        ) : null}
        {!mobile ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={`absolute top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-(--border-app) bg-background text-(--text-muted) shadow-md transition-[color,background-color,box-shadow,transform] duration-200 hover:scale-110 hover:bg-(--surface-muted) hover:text-foreground hover:shadow-lg active:scale-95 ${sidebarOnRight ? "-left-4" : "-right-4"}`}
            aria-label={compact ? tSidebar("expand") : tSidebar("collapse")}
            title={compact ? tSidebar("expand") : tSidebar("collapse")}
          >
            <ChevronLeft
              size={17}
              className={`transition-transform duration-200 ${
                sidebarOnRight
                  ? compact ? "rotate-0" : "rotate-180"
                  : compact ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        ) : null}
      </div>

      <div className="px-3 pb-4 pt-3">
        <button
          type="button"
          onClick={() => {
            openCompose();
            onClose?.();
          }}
          className={`flex w-full items-center justify-center rounded-(--radius-app) bg-(--color-primary) py-3 font-semibold text-white transition hover:brightness-110 ${compact ? "px-0" : "gap-2 px-4"}`}
          aria-label={tFolder("compose")}
          title={compact ? tFolder("compose") : undefined}
        >
          <MailPlus size={20} />
          {!compact ? <span>{tFolder("compose")}</span> : null}
        </button>
      </div>

      <nav aria-label={tSidebar("navigation")} className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {!compact ? <h2 className="px-3 pb-2 pt-2 text-xs font-bold uppercase tracking-[0.14em] text-(--text-muted)">{tSidebar("mailboxGroup")}</h2> : null}
        <ul className="space-y-1">
          {FOLDERS.map((folder, index) => {
            const Icon = FOLDER_ICONS[folder.id];
            const active = pathname === "/" && activeFolder === folder.id;
            const count = unreadCounts[folder.id];
            const label = tFolder(folder.id);
            return (
              <li key={folder.id} className={mobile ? "workspace-menu-item-enter" : undefined} style={mobile ? { animationDelay: `${80 + index * 30}ms` } : undefined}>
                <button
                  type="button"
                  onClick={() => openFolder(folder.id)}
                  className={`flex w-full items-center rounded-(--radius-app) py-2.5 text-sm transition ${compact ? "justify-center px-0" : "gap-3 px-3"} ${active ? navStyle.active : navStyle.idle}`}
                  aria-current={active ? "page" : undefined}
                  aria-label={compact ? label : undefined}
                  title={compact ? label : undefined}
                >
                  <Icon size={19} className="shrink-0" />
                  {!compact ? (
                    <>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate font-medium">{label}</span>
                        <span className="block truncate text-[10px] font-normal text-(--text-muted)">{STORAGE_USAGE[folder.id]}</span>
                      </span>
                      {count > 0 ? <span className="min-w-6 rounded-full bg-(--color-primary) px-1.5 py-0.5 text-center text-xs text-white">{count}</span> : null}
                    </>
                  ) : count > 0 ? <span className="sr-only">{count}</span> : null}
                </button>
              </li>
            );
          })}
          <li className={mobile ? "workspace-menu-item-enter" : undefined} style={mobile ? { animationDelay: `${80 + FOLDERS.length * 30}ms` } : undefined}>
            <Link
              href="/mailboxes"
              onClick={onClose}
              className={`flex items-center rounded-(--radius-app) py-2.5 text-sm transition ${compact ? "justify-center px-0" : "gap-3 px-3"} ${isToolActive(pathname, "/mailboxes") ? navStyle.active : navStyle.idle}`}
              aria-current={isToolActive(pathname, "/mailboxes") ? "page" : undefined}
              aria-label={compact ? tSidebar("mailboxes") : undefined}
              title={compact ? tSidebar("mailboxes") : undefined}
            >
              <Files size={19} className="shrink-0" />
              {!compact ? <span className="truncate">{tSidebar("mailboxes")}</span> : null}
            </Link>
          </li>
        </ul>

        {!compact ? <h2 className="px-3 pb-2 pt-7 text-xs font-bold uppercase tracking-[0.14em] text-(--text-muted)">{tSidebar("tools")}</h2> : <div className="my-4 border-t border-(--border-app)" />}
        <ul className="space-y-1">
          {TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            const active = isToolActive(pathname, tool.href);
            const label = tSidebar(tool.key);
            return (
              <li key={tool.href} className={mobile ? "workspace-menu-item-enter" : undefined} style={mobile ? { animationDelay: `${260 + index * 30}ms` } : undefined}>
                <Link
                  href={tool.href}
                  onClick={onClose}
                  className={`flex items-center rounded-(--radius-app) py-2.5 text-sm transition ${compact ? "justify-center px-0" : "gap-3 px-3"} ${active ? navStyle.active : navStyle.idle}`}
                  aria-current={active ? "page" : undefined}
                  aria-label={compact ? label : undefined}
                  title={compact ? label : undefined}
                >
                  <Icon size={19} className="shrink-0" />
                  {!compact ? <span className="truncate">{label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={logout}
        className={`m-3 flex items-center justify-center rounded-(--radius-app) border border-(--border-app) py-2.5 text-sm text-(--status-danger) transition hover:bg-(--status-danger-bg) active:scale-98 ${compact ? "px-0" : "gap-2 px-3"}`}
        aria-label={tProfile("logout")}
        title={compact ? tProfile("logout") : undefined}
      >
        <LogOut size={18} />
        {!compact ? <span>{tProfile("logout")}</span> : null}
      </button>
    </aside>
  );
}
