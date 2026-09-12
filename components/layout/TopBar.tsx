"use client";

import { FormEvent, Suspense, useEffect, useState, type ReactNode, type RefObject } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, Link, usePathname, useRouter } from "@/i18n/navigation";
import { Bell, HelpCircle, Languages, LogOut, Menu, Paintbrush, Search, ShieldCheck, UserCog, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { localeNames, locales, type Locale } from "@/i18n/routing";
import { CURRENT_USER } from "@/lib/current-user";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { NOTIFICATIONS } from "@/lib/mock-notifications";
import type { LayoutStyle } from "@/types/theme";

type OpenMenu = "none" | "notifications" | "profile";

const HEADER_STYLE: Record<LayoutStyle, string> = {
  classic: "border-b border-(--border-app)",
  card: "shadow-sm",
  minimal: "border-b border-(--border-app)",
};

const SEARCH_STYLE: Record<LayoutStyle, string> = {
  classic: "border border-(--border-app) bg-black/2 dark:bg-white/3",
  card: "border-0 bg-(--surface-muted) shadow-inner",
  minimal: "rounded-none border-0 border-b border-(--border-app) bg-transparent",
};

function GlobalSearchForm({ initialQuery, mobile = false, onSubmitted }: { initialQuery: string; mobile?: boolean; onSubmitted?: () => void }) {
  const t = useTranslations("topBar");
  const router = useRouter();
  const { draft } = useTheme();
  const [query, setQuery] = useState(initialQuery);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    if (!nextQuery) return;
    router.push({ pathname: "/search", query: { q: nextQuery } });
    onSubmitted?.();
  };

  return (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        autoFocus={mobile}
        className={`h-9 w-full rounded-(--radius-app) py-2 pl-9 pr-8 text-sm outline-none transition focus:border-(--color-primary) ${SEARCH_STYLE[draft.layoutStyle]}`}
      />
      {query ? (
        <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-(--text-muted) hover:bg-black/5 dark:hover:bg-white/10" aria-label={t("clearSearch")}>
          <X size={14} />
        </button>
      ) : null}
    </form>
  );
}

function GlobalSearch({ mobile = false, onSubmitted }: { mobile?: boolean; onSubmitted?: () => void }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  return <GlobalSearchForm key={initialQuery} initialQuery={initialQuery} mobile={mobile} onSubmitted={onSubmitted} />;
}

export interface TopBarProps {
  title?: ReactNode;
  actions?: ReactNode;
  menuButtonRef?: RefObject<HTMLButtonElement | null>;
  onMenuClick?: () => void;
  onOpenTour?: () => void;
  onToggleDelegate?: () => void;
  showGlobalSearch?: boolean;
  showMobilePageContext?: boolean;
}

export function TopBar({ title, actions, menuButtonRef, onMenuClick, onOpenTour, onToggleDelegate, showGlobalSearch = false, showMobilePageContext = true }: TopBarProps) {
  const t = useTranslations("topBar");
  const tMenu = useTranslations("profileMenu");
  const tLocale = useTranslations("localeSettings");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { openCustomizer, draft } = useTheme();
  const [openMenu, setOpenMenu] = useState<OpenMenu>("none");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const unreadNotifications = NOTIFICATIONS.filter((notification) => notification.unread);
  const closeMenus = () => setOpenMenu("none");
  const changeLocale = (nextLocale: string) => {
    if (!locales.includes(nextLocale as Locale) || nextLocale === locale) return;
    const suffix = `${window.location.search}${window.location.hash}`;
    closeMenus();
    const localizedPathname = getPathname({
      href: pathname,
      locale: nextLocale as Locale,
      forcePrefix: true,
    });
    window.location.replace(`${localizedPathname}${suffix}`);
  };

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSearchOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileSearchOpen]);

  return (
    <header className={`relative z-20 shrink-0 bg-background ${HEADER_STYLE[draft.layoutStyle]}`}>
      <div className="flex h-14 min-w-0 items-center">
        {onMenuClick ? (
          <button ref={menuButtonRef} type="button" onClick={onMenuClick} className="ml-2 rounded-(--radius-app) p-2 hover:bg-black/5 dark:hover:bg-white/10 xl:hidden" aria-label={t("openMenu")} aria-haspopup="dialog">
            <Menu size={20} />
          </button>
        ) : null}

        <Link href="/" className="flex h-full shrink-0 items-center gap-2 px-2 xl:hidden" aria-label="GXWebMail">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-(--radius-app) text-xs font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>G</span>
          <span className="whitespace-nowrap text-sm font-semibold sm:text-base">GXWebMail</span>
        </Link>

        {title || actions ? (
          <div className={`hidden min-w-0 items-center gap-3 pl-8 pr-3 xl:flex ${showGlobalSearch ? "shrink-0" : "flex-1"}`}>
            {title ? <h1 className="truncate text-sm font-bold">{title}</h1> : null}
            {actions ? <div role="toolbar" className={`flex items-center gap-2 ${showGlobalSearch ? "shrink-0" : "min-w-0 flex-1"}`}>{actions}</div> : null}
          </div>
        ) : null}

        {showGlobalSearch ? (
          <div className="hidden min-w-60 max-w-xl flex-1 px-3 md:block lg:px-4">
            <Suspense fallback={<div className="h-9 rounded-(--radius-app) bg-(--surface-muted)" />}><GlobalSearch /></Suspense>
          </div>
        ) : null}

        <div className="ml-auto flex shrink-0 items-center gap-1 px-2 sm:px-3">
          {showGlobalSearch ? (
            <button type="button" onClick={() => setMobileSearchOpen((open) => !open)} className="rounded-(--radius-app) p-2 hover:bg-black/5 dark:hover:bg-white/10 md:hidden" aria-label={t("searchPlaceholder")} aria-expanded={mobileSearchOpen}>
              {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
          ) : null}
          {onOpenTour ? (
            <button type="button" onClick={onOpenTour} className="hidden rounded-(--radius-app) p-2 hover:bg-black/5 dark:hover:bg-white/10 sm:flex" aria-label={t("tour")} title={t("tour")}><HelpCircle size={18} /></button>
          ) : null}
          <div className="relative">
            <button type="button" onClick={() => setOpenMenu((value) => value === "notifications" ? "none" : "notifications")} className="relative rounded-(--radius-app) p-2 hover:bg-black/5 dark:hover:bg-white/10" aria-label={t("notifications")}>
              <Bell size={18} />
              {unreadNotifications.length > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-accent)" }} /> : null}
            </button>
            {openMenu === "notifications" ? <NotificationPopover onClose={closeMenus} /> : null}
          </div>
          <button
            type="button"
            onClick={openCustomizer}
            className="flex rounded-(--radius-app) p-2 transition hover:bg-black/5 active:translate-y-px dark:hover:bg-white/10"
            aria-label={tMenu("themeCustomizer")}
            title={tMenu("themeCustomizer")}
          >
            <Paintbrush size={18} style={{ color: "var(--color-accent)" }} />
          </button>
          <div className="relative">
            <button type="button" onClick={() => setOpenMenu((value) => value === "profile" ? "none" : "profile")} className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-(--focus-ring)" aria-label={tMenu("profile")}>
              <Avatar name={CURRENT_USER.name} size="sm" />
            </button>
            {openMenu === "profile" ? (
              <>
                <div className="fixed inset-0 z-40" onClick={closeMenus} />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-(--radius-app) border border-(--border-app) bg-background shadow-xl">
                  <div className="flex min-w-0 items-center gap-3 border-b border-(--border-app) px-4 py-3">
                    <Avatar name={CURRENT_USER.name} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{CURRENT_USER.name}</p>
                      <p className="truncate text-xs text-(--text-muted)">{CURRENT_USER.email}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { openCustomizer(); closeMenus(); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"><Paintbrush size={16} style={{ color: "var(--color-accent)" }} />{tMenu("themeCustomizer")}</button>
                  <div className="flex items-start gap-2 border-t border-(--border-app) px-4 py-2.5">
                    <Languages size={16} className="mt-2.5 shrink-0 text-(--text-muted)" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="mb-1.5 text-xs font-medium text-(--text-muted)">{tLocale("displayLanguage")}</p>
                      <Dropdown
                        value={locale}
                        options={locales.map((value) => ({ value, label: localeNames[value] }))}
                        onChange={changeLocale}
                        variant="form"
                      />
                    </div>
                  </div>
                  <Link href="/admin" onClick={closeMenus} className="flex w-full items-center gap-2 border-t border-(--border-app) px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"><ShieldCheck size={16} className="text-(--text-muted)" />{tMenu("admin")}</Link>
                  {onToggleDelegate ? <button type="button" onClick={() => { onToggleDelegate(); closeMenus(); }} className="flex w-full items-center gap-2 border-t border-(--border-app) px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"><UserCog size={16} className="text-(--text-muted)" />{tMenu("switchToDelegate")}</button> : null}
                  <button type="button" onClick={() => { closeMenus(); try { window.localStorage.removeItem("gxmail:session"); window.sessionStorage.removeItem("gxmail:session-expires-at"); } catch {} router.push("/login"); }} className="flex w-full items-center gap-2 border-t border-(--border-app) px-4 py-2.5 text-left text-sm text-(--status-danger) hover:bg-black/5 dark:hover:bg-white/5"><LogOut size={16} />{tMenu("logout")}</button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {showMobilePageContext && (title || actions) ? <div className="flex min-h-11 items-center gap-3 border-t border-(--border-app) px-3 py-2 xl:hidden">{title ? <h1 className="min-w-0 flex-1 truncate text-sm font-bold">{title}</h1> : null}{actions ? <div role="toolbar" className="flex shrink-0 items-center gap-2">{actions}</div> : null}</div> : null}
      {showGlobalSearch && mobileSearchOpen ? <div className="border-t border-(--border-app) px-3 py-2 md:hidden"><Suspense fallback={<div className="h-9 rounded-(--radius-app) bg-(--surface-muted)" />}><GlobalSearch mobile onSubmitted={() => setMobileSearchOpen(false)} /></Suspense></div> : null}
    </header>
  );
}
